const HostHelper = require('hosts').HostHelper;
const DatabaseConfiguration = require('configuration').DatabaseConfiguration;
const ShardHost = function(params){
	var _databaseConfiguration;
	this.getHost = function(){
		return params.host;
	};
	this.getHostId = function(){
		return params.host.getId();
	};
	this.getLoadHandlingFactor = function(){
		return params.loadHandlingFactor;
	};
	this.getUser = getUser;
	function getUser(){
		return params.user;
	};
	this.getPassword= getPassword;
	function getPassword(){
		return params.password;
	};
	this.getDatabaseConfiguration = function(){
		if(_databaseConfiguration)return _databaseConiguration;
		_databaseConfiguration = new DatabaseConfiguration({
			user:getUser(),
			password:getPassword(),
			server:host.getIp(),
			database:null
		});
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