const Accumulator = require('./Accumulator');
const Settings = require('./Settings');
const ShardHostHelper = require('./ShardHostHelper');
const DalPmsShard = require('./DalPmsShard');
const DatabaseConfiguration= require('configuration').DatabaseConfiguration;
function Shard(params){
	const userIdToExclusive = params.userIdToExclusive;
	const userIdFromInclusive = params.userIdFromInclusive;
	const databaseConfiguration = params.databaseConfiguration;
	const shardHost = params.shardHost;
	const settings = params.settings;
	const sendToDevices = params.sendToDevices;
	if(!shardHost)throw new Error('No shardHost');
	if(!userIdFromInclusive)throw new Error('No userIdFromInclusive provied');
	if(!userIdToExclusive)throw new Error('No userIdToExclusive provied');
	if(!databaseConfiguration)throw new Error('No databaseConfiguration provied');
	if(!settings)throw new Error('No settings provied');
	if(!sendToDevices)throw new Error('No sendToDevices provied');
	const dalPmsShard = new DalPmsShard(databaseConfiguration);
	const accumulator = new Accumulator({
		settings:settings,
		dalPmsShard:dalPmsShard,
		sendToDevices:sendToDevices
	});
	this.setId = function(value){
		if(params.id)throw new Error('id already set');
		params.id = value;
	};
	this.getId=function(){
		return params.id;
	};
	this.getUserIdToExclusive = function(){
		return userIdToExclusive;
	};
	this.getUserIdFromInclusive = function(){
		return userIdFromInclusive;
	};
	this.getName = function(){
		return databaseConfiguration.getDatabase();
	};
	this.getHostId = getHostId;
	this.getShardHost=function(){
		return shardHost;
	};
	this.add = function(message){
		accumulator.add(message);
	};
	this.get = function(userIdFrom, userIdTo, n, fromInclusive, toExclusive){
		return dalPmsShard.get(userIdFrom, userIdTo, n, fromInclusive, toExclusive);
	};
	this.toJSON= function(){
		return {
			id:params.id,
			hostId:getHostId(),
			userIdToExclusive:params.userIdToExclusive,
			userIdFromInclusive:params.userIdFromInclusive,
			databaseConfiguration:databaseConfiguration.toJSON()
		};
	};
	this.update = function(){
		return dalPmsShard.update();
	};
	function getHostId(){
		return shardHost.getHostId();
	}
};
Shard.fromSqlRow=function(row, sendToDevices){
	return new Promise((resolve, reject)=>{
		//id, hostId, created, name, userIdFromInclusive, userIdToExclusive,
		var hostId = row.hostId;
		if(!hostId)throw new Error('No hostId');
		ShardHostHelper.getById(hostId).then((shardHost)=>{
			if(!shardHost)throw new Error('No ShardHost for this hostId');
			Settings.get().then((settings)=>{
				row.shardHost=shardHost;
				row.databaseConfiguration=new DatabaseConfiguration({
					database:row.name,
					server:shardHost.getHost().getIp(),
					user:shardHost.getUser(),
					password:shardHost.getPassword()
				});
				row.sendToDevices = sendToDevices;
				row.settings = settings;
				resolve(new Shard(row));
			}).catch(reject);
		}).catch(reject);
	});
};
Shard.fromJSON=function(obj, sendToDevices){
	return new Promise((resolve, reject)=>{
		//id, hostId, created, name, userIdFromInclusive, userIdToExclusive,=
		ShardHostHelper.getById(obj.hostId).then((shardHost)=>{
			if(!shardHost)throw new Error('No ShardHost for this hostId');
			Settings.get().then((settings)=>{
				obj.shardHost = shardHost;
				obj.sendToDevices = sendToDevices;
				obj.settings = settings;
				obj.databaseConfiguration= DatabaseConfiguration.fromJSON(obj.databaseConfiguration);
				resolve(new Shard(obj));
			}).catch(reject);
		}).catch(reject);
	});
};
module.exports = Shard;