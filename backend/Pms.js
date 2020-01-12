module.exports = new(function(){ 
	const DalPms = require('./DalPms');
	const Shards = require('./Shards');
	this.get = function(userIdFrom, userIdTo, fromInclusive, toInclusive){
	console.log('GET');
		return new Promise((resolve, reject)=>{
			Shards.getShardForUserIds(userIdFrom, userIdTo).then((shard)=>{
				console.log('shard');
			}).catch(reject);
		});
	};
	this.add = function(){
		
	};
})();