const ShardHost = function(params){
	this.getHost = function(){
		return params.host;
	};
	this.getHostId = function(){
		return params.host.getHostId();
	};
	this.getLoadHandlingFactor = function(){
		return params.loadHandlingFactor;
	};
	this.getUser = function(){
		return params.user;
	};
};
ShardHost.fromSqlRow = function(row){
	return new Promise((resolve, reject)=>{
		var hostId = row.hostId;
		HostHelper.getById(hostId).then((host)=>{
			if(!host)throw new Error('ShardHost with hostId '+hostId+' had no actual Host counterpart');
			resolve(new ShardHost({host:host, loadHandlingFactor:row.loadHandlingFactor, user:row.user}));
		}).catch(reject);
	});
};
module.exports = ShardHost;