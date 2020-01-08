module.exports = new(function(){
	var initialized= false;
	var shards;
	const DalPms = require('./DalPms');
	var shardsCreator;
	this.initialize = function(databaseConfiguration, shardsCreatorIn){
		shardsCreator = shardsCreatorIn;
		return new Promise((resolve, reject)=>{
			if(initialized)throw new Error('Already initialized');
			DalPms.initialize(databaseConfiguration);
			DalPms.getShards().then((shardsIn)=>{
				console.log(shardsIn);
				shards = shardsIn;
				initialized = true;
				resolve();
			}).catch(reject);
		});
	};
	this.getShardForUserIds=function(userId1, userId2){
		var userIdHighest = userId1>userId2?userId1:userId2;
		return getShardForHighestUserId(userIdHighest);
	};
	this.getShardForHighestUserId = getSsshardForHighestUserId;
	function getShardForHighestUserId(userIdHighest){
		return new Promise((resolve, reject)=>{
			var shard = _getShardForHighestUserId(userIdHighest);
			if(shard){
				resolve(shard);
				return;
			}
			createNextShards(userIdHighest).then(resolve).catch(reject);
		});
	}
	function _getShardForHighestUserId(userIdHighest){
		for(var i=0, shard; shard= shards[i]; i++){
			if(shard.getUserIdToExclusive()>userIdHighest&&shard.getUserIdFromInclusive()<=userIdHighest)
			{
				return shard;
			}
		}
	}
	function createNextShards(userIdHighest){
		
	}
	function createNextShardsWithMeAsShardCreator(userIdHighest){
		return new Promise((resolve, reject)=>{
			var createNextShardsCallback = new CreateNextShardsCallback(resolve, reject, userIdHighest);
			if(createNextShardsLifespan){
				createNextShardsLifespan.add(createNextShardsCallback);
				createNextShardsLifespan.updateHighestUserId(userIdHighest);
				return;
			}
			createNextShardsLifespan=new CreateNextShardsLifespan(createNextShardsCallback, userIdHighest);
			var latestShard = shards[shards.length-1];
			var userIdFromInclusive = latestShard?latestShard.getUserIdToExclusive():1;
			next();
			function next(){
				var userIdToExclusive = userIdFromInclusive + SHARD_SIZE
				ShardBuilder.build({
					userIdToExclusive:userIdToExclusive,
					userIdFromInclusive:userIdFromInclusive,
					host:host
				}).then((shard)=>{
					shards.push(shard);
					createNextShardsLifespan.doResolves(shard, userIdFromInclusive, userIdToExclusive);
					userIdFromInclusive = userIdToExclusive;
					if(userIdFromInclusive>createNextShardsLifespan.getUserIdHighest()){
						createNextShardsLifespan=null;
						return;
					}
					next();
				}).catch((err)=>{
					createNextShardsLifespan.doRejects(err);
					createNextShardsLifespan=null;
				});
			}
		});
	}
	function CreateNextShardsLifespan (createNextShardsCallback, userIdHighest){
		var list =[createNextShardsCallback];
		this.updateHighestUserId=function(newUserIdHighest){
			if(newUserIdHighest<=userIdHighest)return;
			userIdHighest = newUserIdHighest;
		};
		this.getUserIdHighest = function(){return userIdHighest;};
		this.add = function(createNextShardsCallback){
			list.push(createNextShardsCallback);
		};
		this.doResolves = function(shard, userIdFromInclusive, userIdToExclusive){
			var iterator = new Iterator(list);
			while(iterator.hasNext()){
				var createNextShardsCallback = iterator.next();
				var userIdHighest = createNextShardsCallback.getUserIdHighest();
				if(userIdHighest<userIdFromInclusive||userIdHighest>=userIdToExclusive)continue;
				iterator.remove();
				createNextShardsCallback.resolve(shard);
			});
		};
		this.doRejects = function(err){
			list.forEach((createNextShardsCallback)=>{
				createNextShardsCallback.reject(err);
			});
			list = null;//be safe just incase
		};
	}
	function CreateNextShardsCallback(resolve, reject, userIdHighest){
		this.getUserIdHighest = function(){return userIdHighest;};
		this.resolve = function(shard){
			resolve(shard);
		};
		this.reject = function(err){
			reject(err);
		};
	}
})();