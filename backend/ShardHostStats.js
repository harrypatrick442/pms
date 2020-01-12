module.exports = function(params){
	this.getNUsers = function(){
		return params.nUsers;
		
	};
	this.getLoadHandlingFactor = function(){
		return getShardHost().getLoadHandlingFactor();
	};
	this.getShardHost = getShardHost;
	function getShardHost(){
		return params.shardHost;
	}
};