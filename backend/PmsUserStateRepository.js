const S = require('strings').S;
const DalPms = require('./DalPms');
const Shards = require('./Shards');
const Client = require('client');
module.exports = new(function(){ 
	
	var cache = new Cache({
		name:'Pms User State Cache',
		getFromDatabaseById:shard.getPmsUserState,
		updateToDatabase:updateToDatabase,
		merge:merge,
		router:PmsUserStateRouter,
		provideRemote:false
	});
	ProfilesRouter.setPmsUserStateCache(cache);
	this.getByUserIdRaw = function(userId){
		return cache.getById(userId);
	};
	/*this.getByUserIdWrapped = function(userId){
		return new Promise(function(resolve, reject){
			cache.getById(userId).then(function(raw){
				resolve(raw?Profile.fromJSON(raw):null);
			}).catch(reject);
		});
	};*/
	this.update = function(userId, pmUserState){
		return cache.update(userId, pmUserState);	
	};
	function updateToDatabase(userId, pmUserState){
		return new Promise((resolve, reject)=>{
			Shards.getShardForUserSpecific(userId).then((shard)=>{
				shard.setUserState(userId, pmUserState).then(()=>{}).catch(reject);
			}).catch(reject);
		});
	}
	function merge(incoming, local){
		return incoming;
	}
})();