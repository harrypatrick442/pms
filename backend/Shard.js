const Accumulator = require('./Accumulator');
const Settings = require('./Settings');
function Shard(params){
	const userIdToExclusive = params.userIdToExclusive;
	const userIdFromInclusive = params.userIdFromInclusive;
	const databaseConfiguration = params.databaseConfiguration;
	const hostId = params.hostId;
	if(!userIdFromInclusive)throw new Error('No userIdFromInclusive provied');
	if(!userIdToExclusive)throw new Error('No userIdToExclusive provied');
	if(!databaseConfiguration)throw new Error('No databaseConfiguration provied');
	if(!hostId)throw new Error('No hostId provied');
	const DalPmsShard = new DalPmsShard(databaseConfiguration);
	const Accumulator = new Accumulator();
	this.getId=function(){
		return params.id;
	};
	this.getUserIdToExclusive = function(){
		return userIdToExclusive;
	};
	this.getUserIdFromInclusive = function(){
		return userIdFromInclusive;
	};
	this.getHostId = function(){
		return hostId;
	};
	this.add = function(){
		pmsAccumulator.add();
	};
	this.get = function(){
		
	};
	this.toJSON= function(){
		return {
			id:params.id,
			hostId:params.hostId,
			userIdToExclusive:params.userIdToExclusive,
			userIdFromInclusive:params.userIdFromInclusive,
			databaseConfiguration:databaseConfiguration.toJSON()
		};
	};
};
Shard.fromSqlRow=function(row){
	return new Promise((resolve, reject)=>{
		//id, hostId, created, name, password, userIdFromInclusive, userIdToExclusive,
		var hostId = row.hostId;
		if(!hostId)throw new Error('No hostId');
		HostHelper.getById(hostId).then((host)=>{
			Settings.get().then((settings)=>{
				row.databaseConfiguration=new DatabaseConfiguration({
					password:row.password,
					user:settings.getShardsUser(),
					database:row.name,
					server:host.getIp()
				});
				resolve(new Shard(row));
			}).catch(reject);
		}).catch(reject);
	});
};
Shard.fromJSON=function(obj){
	return new Promise((resolve, reject)=>{
		//id, hostId, created, name, password, userIdFromInclusive, userIdToExclusive,=
			Settings.get().then((settings)=>{
				obj.databaseConfiguration=new DatabaseConfiguration.fromJSON(obj.databaseConiguration);
				resolve(new Shard(obj));
			}).catch(reject);
		}).catch(reject);
	});
};
module.exports = Shard;