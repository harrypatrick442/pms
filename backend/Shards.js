module.exports = new(function(){
	var initialized= false;
	var shards;
	var mapIdToShard={};
	const Settings = require('./Settings');
	const DalPms = require('./DalPms');
	var shardsCreator;
	this.initialize = function(databaseConfiguration,shardsCreatorIn){
		shardsCreator = shardsCreatorIn;
		return new Promise((resolve, reject)=>{
			if(initialized)throw new Error('Already initialized');
			DalPms.initialize(databaseConfiguration);
			Settings.get().then((settings)=>{
				HostsHelper.getHostMe().then((hostMe)=>{
					shardsCreator = hostMe.getId()===settings.getHostIdShardCreator();
					DalPms.getShards().then((shardsIn)=>{
						console.log(shardsIn);
						shards = shardsIn;
						shards.forEach((shard)=>{
							mapIdToShard[shard.getId()]=shard;
						});
						if(shardsCreator){
							Router.addMessageCallback(S.CREATE_NEXT_SHARD, createNextShardFromRemote);
						}
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
					type:S.CREATE_NEXT_SHARD,
					userIdHighest:userIdHighest,
					myNextUserIdFromInclusive:getNextShardUserIdFromInclusive()
				}, 10000).then((res)=>{
					if(!res.successful){
						throw new Error('Error creating shard on remote machine: '+res.err.stack);
					}
					var shard;
					res.shards.forEach((jObject)=>{
						shard = addShardFromJObjectIfDoesntExist(jObject);
					});
					resolve(shard);
				}).catch(reject);
			}).catch(reject);
		});
	}
	function addShardFromJObjectIfDoesntExist(jObject){
		var id = jObject.id;
		if(!id)throw new Error('No id');
		var shard = getShardById(id);
		if(shard)return shard;
		shard = Shard.fromJSON(res.shard);
		addShard(shard);
		return shard;
	}
	function createNextShardFromRemote(msg, channel){
		var userIdHighest = msg.userIdHighest;
		var myNextUserIdFromInclusive = msg.myNextUserIdFromInclusive;
		var localUserIdToExclusive = getNextShardUserIdFromInclusive()-1;
			//sendShardsUsingChannel(existingShards, channel);
		if(localUserIdToExclusive<=userIdHighest){
			createNextShardsWithMeAsShardCreator(userIdHighest).then((newShardForUserIdHighest)=>{
				sendShardsUsingChannel(getShardsInRange(myNextUserIdFromInclusive, userIdHighes+1), channel);
			}).catch(error);
			return;
		}
		sendShardsUsingChannel(getShardsInRange(myNextUserIdFromInclusive, userIdHighest+1), channel);
		}).catch(error);
		function error(err){
			channel.send({
				msg.ticket,
				successful:false,
				err:err
			});
		}
	}s
	function sendShardUsingChannel(shard, channel){
		channel.send({
			msg.ticket,
			successful:true,
			shard:shard.toJSON()
		});
	}
	function createNextShardsWithMeAsShardCreator(userIdHighest){//When this is called checks have already been done to see if the shard already exist.
		return new Promise((resolve, reject)=>{
			var createNextShardsCallback = new CreateNextShardsCallback(resolve, reject, userIdHighest);
			if(createNextShardsLifespan){
				createNextShardsLifespan.add(createNextShardsCallback);
				createNextShardsLifespan.updateHighestUserId(userIdHighest);
				return;
			}
			createNextShardsLifespan=new CreateNextShardsLifespan(createNextShardsCallback, userIdHighest);
			var userIdFromInclusive = getNextShardUserIdFromInclusive();
			next();
			function next(){
				var userIdToExclusive = userIdFromInclusive + SHARD_SIZE
				ShardBuilder.build({
					userIdToExclusive:userIdToExclusive,
					userIdFromInclusive:userIdFromInclusive,
					host:host
				}).then((shard)=>{
					DalShards.addShard(shard).then(()=>{
						addShard(shard);
						createNextShardsLifespan.doResolves(shard, userIdFromInclusive, userIdToExclusive);
						userIdFromInclusive = userIdToExclusive;
						if(userIdFromInclusive>createNextShardsLifespan.getUserIdHighest()){
							if(createNextShardsLifespan.getNCallbacksLeft()>0)
								throw new Error('There were somehow still callbacks left');//just going to make this easier to debug.s
							createNextShardsLifespan=null;
							return;
						}
						next();
					}).catch(error);
				}).catch(error);
			}
			function error(err){
				createNextShardsLifespan.doRejects(err);
				createNextShardsLifespan=null;
			};
		});
	}
	function addShard(newShard){
		addShard_insertIntoShardss(newShard);
		mapIdToShard[newShard.getId()]=newShard;
		if(shardsCreator)
			sendToOtherClientDataHosts(newShard);
		return newShard;
	}
	function sendToOtherClientDataHosts(newShard){
		throw new Error('Not implemented');
	}
	function addShard_insertIntoShards(newShard){
		var index=0;
		do{
			var shard = shards[index];
			if(shard.getId()>newShard.getId()){
				shards.splice(index, 0, newShard);
				return;
			}
			index++;
		}while(index<shards.length);
		shards.push(newShard);
		return newShard;
	}
	function getNextShardUserIdFromInclusive(){
		var latestShard = shards[shards.length-1];
		return latestShard?latestShard.getUserIdToExclusive():1;
	}
	function getShardsInRange(userIdFromInclusive, userIdToExclusive){
		var iterator = new Iterator(shards);
		var list=[];
		while(iterator.hasNext()){
			var shard = iterator.next();
			if(shard.getUserIdFromInclusive()>=userIdToExclusive)break;
			if(shard.getUserIdToExclusive()>userIdFromInclusive)list.push(shard);
		}
		return list;
	}
	function checkInitialized(){
		if(!initialized)throw new Error('Not initialized');
	}
})();