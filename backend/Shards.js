module.exports = new(function(){
	var initialized= false;
	var coniguration;
	var shards;
	const DalPms = require('./DalPms');
	this.initialize = function(configurationIn){
		return new Promise((resolve, reject)=>{
			if(initialized)throw new Error('Already initialized');
			configuration = configurationIn;
			DalPms.initialize(configuration);
			DalPms.getShards().then((shardsIn)=>{
				shards = shardsIn;
				initialized = true;
				resolve();
			}).catch(reject);
		});
	};
	this.getShardForUserIds(userId1, userId2){
		var userIdHighest = userId1>userId2?userId1:userId2;
		return getShardForHighestUserId(userIdHighest);
	};
	this.getShardForHighestUserId = getShardForHighestUserId;
	function getShardForHighestUserId(userIdHighest){
		for(var i=0, shard; shard= shards[i]; i++){
			if(shard.getUserIdToExclusive()>userIdHighest&&shard.getUserIdFromInclusive()<=userIdHighest)
				return shard;
		}
	}
})();