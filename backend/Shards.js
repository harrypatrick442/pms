module.exports = new(function(){
	var initialized= false;
	var shards;
	const DalPms = require('./DalPms');
	var shardsCreator, _settings;
	this.initialize = function(databaseConfiguration){
		shardsCreator = shardsCreatorIn;
		return new Promise((resolve, reject)=>{
			if(initialized)throw new Error('Already initialized');
			DalPms.initialize(databaseConfiguration);
			getSettings().then((settings)=>{
				HostsHelper.getHostMe().then((hostMe)=>{
					shardsCreator = hostMe.getId()===settings.getHostIdShardCreator();
					DalPms.getShards().then((shardsIn)=>{
						console.log(shardsIn);
						shards = shardsIn;
						initialized = true;
						resolve();
					}).catch(reject);
				}).catch(reject);
			}).catch(reject);
		});
	};
	this.getShardForUserIds=function(userId1, userId2){
		var userIdHighest = userId1>userId2?userId1:userId2;
		return getShardForHighestUserId(userIdHighest);
	};
	this.getShardForHighestUserId = getShardForHighestUserId;
	function getSettings(){
		return new Promise((resolve, reject)=>{
			if(_settings){resolve(_settings);return;}
			DalPms.getSettings().then((settings)=>{
				_settings = settings;
				resolve(settings);
			}).catch(reject);
		});
	}
	function getShardForHighestUserId(userIdHighest){
		return new Promise((resolve, reject)=>{
			checkInitialized();
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
		checkInitialized();
		(shardCreator?createNextShardsWithMeAsShardCreator:createNextShardsRemote)(userIdHighest);
	}
	function createNextShardsRemote(userIdHighest){
		return new Promise((resolve, reject)=>{
			getSettings().then((settings)=>{
			var channel = Router.getChannelForHostId(settings.getHostIdShardCreator());	
			if(!channel)throw new Error('Could not get the channel for the shard creator');
			TicketedSend.sendWithPromise(channel, {
				
			}, 10000).then((res)=>{
				
			}).catch(reject);
		});
	}
	function createNextShardsWithMeAsShardCreator(userIdHighest){//yes im good.
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
	function checkInitialized(){
		if(!initialized)throw new Error('Not initialized');
	}
})();