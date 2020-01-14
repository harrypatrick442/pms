const Core = require('core');
Core.Linq;
const DalPms = require('./DalPms');
module.exports = new(function(){
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
			console.log(DalPms);
			DalPms.getShardHosts().then((shardHosts)=>{
				_mapIdToShardHost = shardHosts.toMap(shardHost=>shardHost.getHostId(), shardHost=>shardHost);
				_shardHosts = shardHosts;
				resolve(shardHosts);
			});
		});
	};
})();