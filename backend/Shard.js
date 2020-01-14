const Accumulator = require('./Accumulator');
const Settings = require('./Settings');
const ShardHostHelper = require('./ShardHostHelper');
const DalPmsShard = require('./DalPmsShard');
function Shard(params){
	const userIdToExclusive = params.userIdToExclusive;
	const userIdFromInclusive = params.userIdFromInclusive;
	const databaseConfiguration = params.databaseConfiguration;
	const shardHost = params.shardHost;
	if(!shardHost)throw new Error('No shardHost');
	if(!userIdFromInclusive)throw new Error('No userIdFromInclusive provied');
	if(!userIdToExclusive)throw new Error('No userIdToExclusive provied');
	if(!databaseConfiguration)throw new Error('No databaseConfiguration provied');
	const dalPmsShard = new DalPmsShard(databaseConfiguration);
	const accumultor = new Accumulator();
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
	this.add = function(){
		pmsAccumulator.add();
	};
	this.get = function(){
		
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
		return new Promise((resolve, reject)=>{
			resolve();
		});
	};
	function getHostId(){
		return shardHost.getHostId();
	}
};
Shard.fromSqlRow=function(row){
	return new Promise((resolve, reject)=>{
		//id, hostId, created, name, userIdFromInclusive, userIdToExclusive,
		var hostId = row.hostId;
		if(!hostId)throw new Error('No hostId');
		SharHostHelper.getById(hostId).then((shardHost)=>{
			if(!shardHost)throw new Error('No ShardHost for this hostId');
			row.shardHost=shardHost;
			row.databaseConfiguration=new DatabaseConfiguration({
				database:row.name,
				server:shardHost.getHost().getIp(),
				user:shardHost.getUser()
			});
			resolve(new Shard(row));
		}).catch(reject);
	});
};
Shard.fromJSON=function(obj){
	return new Promise((resolve, reject)=>{
		//id, hostId, created, name, userIdFromInclusive, userIdToExclusive,=
		ShardHostHelper.getById(obj.hostId).then((shardHost)=>{
			if(!shardHost)throw new Error('No ShardHost for this hostId');
			obj.shardHost = shardHost;
			obj.databaseConfiguration= DatabaseConfiguration.fromJSON(obj.databaseConiguration);
			resolve(new Shard(obj));
		}).catch(reject);
	});
};
module.exports = Shard;