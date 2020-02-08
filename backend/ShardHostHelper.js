const Core = require('core');
Core.Linq;
module.exports = function(dalPms){
	var _shardHosts;
	var _mapIdToShardHost;
	this.getById=function(hostId){
		return new Promise((resolve, reject)=>{
			get().then(()=>{
				resolve(_mapIdToShardHost.get(hostId));
			}).catch(reject);
		});
	};
	this.get = get;
	function get(){
		return new Promise((resolve, reject)=>{
			if(_shardHosts){
				resolve(_shardHosts);
				return;
			}
			DalShards.getShardHosts(ShardTypes.PMS).then((shardHosts)=>{
				_mapIdToShardHost = shardHosts.toMap(shardHost=>shardHost.getHostId(), shardHost=>shardHost);
				_shardHosts = shardHosts;
				resolve(shardHosts);
			});
		});
	};
};