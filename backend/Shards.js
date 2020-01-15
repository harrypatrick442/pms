module.exports = new(function(){
	var initialized= false;
	const Settings = require('./Settings');
	const Core = require('core');
	const Iterator = Core.Iterator;
	Core.Linq;
	const S = require('strings').S;
	const DalPms = require('./DalPms');
	const HostHelper = require('hosts').HostHelper;
	const ShardHostHelper = require('./ShardHostHelper');
	const Router = require('interserver_communication').Router;
	const TicketedSend=Core.TicketedSend;
	const ShardHostStats = require('./ShardHostStats');
	const CreateNextShardsCallback= require('./CreateNextShardsCallback');
	const CreateNextShardsLifespan= require('./CreateNextShardsLifespan');
	const PmsShardBuilder= require('./PmsShardBuilder');
	const Shard = require('./Shard');
	const PmsLog = require('./PmsLog');
	var shards, shardsCreator,createNextShardsLifespan, shardHosts, mapIdToShard=new Map();
	this.initialize = initialize;
	this.getShardForUserIds=function(userId1, userId2){
		return new Promise((resolve, reject)=>{
			userId2 = 60000;
			getShardForUserIds(userId1, userId2).then((shard)=>{
				resolve(shard);
			}).catch((err)=>{
				PmsLog.error(err);
				reject(err);
			});
		});
	};
	this.getShardForHighestUserId = getShardForHighestUserId;
	function initialize(databaseConfiguration,shardsCreatorIn){
		shardsCreator = shardsCreatorIn;
		return new Promise((resolve, reject)=>{
			if(initialized)throw new Error('Already initialized');
			DalPms.initialize(databaseConfiguration);
			Settings.get().then((settings)=>{
				HostHelper.getHostMe().then((hostMe)=>{ 
					ShardHostHelper.get().then((shardHostsIn)=>{
						shardHosts = shardHostsIn;
						shardsCreator = hostMe.getId()===settings.getHostIdShardCreator();
						DalPms.getShards().then((shardsIn)=>{
							shards = shardsIn;
							shards.forEach((shard)=>{
								mapIdToShard.set(shard.getId(),shard);
							});
							if(shardsCreator){
								Router.get().addMessageCallback(S.CREATE_NEXT_SHARD, createNextShardFromRemote);
							}
							initialized = true;
							resolve();
						}).catch(reject);
					}).catch(reject);
				}).catch(reject);
			}).catch(reject);
		});
	}
	function getShardForUserIds(userId1, userId2){
		var userIdHighest = userId1>userId2?userId1:userId2;
		return getShardForHighestUserId(userIdHighest);
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
		return (shardsCreator?createNextShardsWithMeAsShardCreator:createNextShardsRemote)(userIdHighest);
	}
	function createNextShardsRemote(userIdHighest){
	console.log('createNextShardsRemote');
		return new Promise((resolve, reject)=>{
			Settings.get().then((settings)=>{
				var channel = Router.get().getChannelForHostId(settings.getHostIdShardCreator());
				if(!channel)throw new Error('Could not get the channel for the shard creator');
				TicketedSend.sendWithPromise(channel, {
					type:S.CREATE_NEXT_SHARD,
					userIdHighest:userIdHighest,
					myNextUserIdFromInclusive:getNextShardUserIdFromInclusive()
				}, 10000).then((res)=>{
	console.log(res);
					if(!res.successful){
						throw new Error('Error creating shard on remote machine');
					}
					addShardsFromJObjectsIfDontExist(res.shards).then(resolve).catch(reject);
				}).catch(reject);
			}).catch(reject);
		});
	}
	function getShardById(id){
		return mapIdToShard.get(id);
	}
	function addShardsFromJObjectsIfDontExist(jObjects){
		return new Promise((resolve, reject)=>{
			var iteratorShardJObjects = new Iterator(jObjects);
			next();
			function next(shard){
				if(!iteratorShardJObjects.hasNext()){
					resolve(shard);//the last shard is for the userIdHighest which corresponds to the one we needed.
					return;
				}
				var jObject = iteratorShardJObjects.next();
				addShardFromJObjectIfDoesntExist(jObject).then(next).catch(reject);
			}
		});
	}
	function addShardFromJObjectIfDoesntExist(jObject){
		return new Promise((resolve, reject)=>{
			var id = jObject.id;
			if(!id)throw new Error('No id');
			var shard = getShardById(id);
			if(shard){
				resolve(shard);
				return;
			};
			Shard.fromJSON(jObject).then((shard)=>{
			addShard(shard);
			resolve(shard);
			}).catch(reject);
		});
	}
	function createNextShardFromRemote(msg, channel){
		console.log('hi');
		if(!initialized){
			error('Not Initialized');
			return;
		}
		var userIdHighest = msg.userIdHighest;
		var myNextUserIdFromInclusive = msg.myNextUserIdFromInclusive;
		var localUserIdToExclusive = getNextShardUserIdFromInclusive()-1;
		var ticket = msg.ticket;
		if(localUserIdToExclusive<=userIdHighest){
			createNextShardsWithMeAsShardCreator(userIdHighest, channel).then((newShardForUserIdHighest)=>{
				sendShardsUsingChannel(getShardsInRange(myNextUserIdFromInclusive, userIdHighest+1, true), channel, ticket);
			}).catch(error);
			return;
		}
		sendShardsUsingChannel(getShardsInRange(myNextUserIdFromInclusive, userIdHighest+1, true), channel, ticket);
		function error(err){
			PmsLog.error(err);
			channel.send({
				ticket:msg.ticket,
				successful:false
			});
		}
	}
	function sendShardsUsingChannel(shards, channel, ticket){
		console.log('sending back');
		channel.send({
			ticket:ticket,
			successful:true,
			shards:shards.select(shard=>shard.toJSON()).toList()
		});
	}
	function createNextShardsWithMeAsShardCreator(userIdHighest, channel){//When this is called checks have already been done to see if the shard already exist.
		return new Promise((resolve, reject)=>{
			var createNextShardsCallback = new CreateNextShardsCallback(resolve, reject, userIdHighest);
			if(createNextShardsLifespan){
				createNextShardsLifespan.add(createNextShardsCallback);
				createNextShardsLifespan.updateHighestUserId(userIdHighest);
				return;
			}
			createNextShardsLifespan=new CreateNextShardsLifespan(createNextShardsCallback, userIdHighest);
			var userIdFromInclusive = getNextShardUserIdFromInclusive();
			var shardSize;
			Settings.get().then((settings)=>{
				shardSize = settings.getShardSize();
				next();
			}).catch(reject);
			function next(){
				var userIdToExclusive = userIdFromInclusive + shardSize
				var shardHost = pickShardHostForNextShard();
				PmsShardBuilder.build({
					userIdToExclusive:userIdToExclusive,
					userIdFromInclusive:userIdFromInclusive,
					shardHost:shardHost
				}).then((shard)=>{
					DalPms.addShard(shard).then(()=>{
						addShard(shard);
						if(shardsCreator)
							sendToOtherClientDataHosts(shard, channel);
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
		addShard_insertIntoShards(newShard);
		mapIdToShard.set(newShard.getId(),newShard);
		return newShard;
	}
	function sendToOtherClientDataHosts(newShard, channelToSkip){
		var msg = {
			type:S.NEW_SHARD,
			shard:newShard
		};
		shardHosts.forEach((shardHost)=>{
			var channel = Router.get().getChannelForHostId(shardHost.getHostId());
			if(channel&&(channel!==channelToSkip))
				try{channel.send(msg);}catch(ex){console.error(ex);}//This is not critical and put this here just to be safe. It doesn't particularly matter if this fails, cos it will simply get the shard when it next request creation.		
		});
	}
	function addShard_insertIntoShards(newShard){
		var index=0;
		do{
			var shard = shards[index];
			if(!shard)break;
			if(shard.getId()>newShard.getId()){
				shards.splice(index, 0, newShard);
				return newShard;
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
	function getShardsInRange(userIdFromInclusive, userIdToExclusive, errorIfNotCovered/* making shit easier to be debugged*/){
		var iterator = new Iterator(shards);
		var list=[];
		
		while(iterator.hasNext()){
			var shard = iterator.next();
			if(shard.getUserIdFromInclusive()>=userIdToExclusive){
				break;
			}
			if(shard.getUserIdToExclusive()>userIdFromInclusive)list.push(shard);
		}
		if(errorIfNotCovered&&(list.length<1||list[0].getUserIdFromInclusive()>userIdFromInclusive||list[list.length-1].getUserIdToExclusive()<userIdToExclusive))
			throw new Error('Range not covered');
		return list;
	}
	function checkInitialized(){
		if(!initialized)throw new Error('Not initialized');
	}
	function pickShardHostForNextShard(){
		var shardHostStatss = getShardHostStatss();
		var shardHost = shardHostStatss.orderByDesc(shardHostStats=>(shardHostStats.getNUsers()/shardHostStats.getLoadHandlingFactor())).first().getShardHost();
		return shardHost;
	}
	function getShardHostStatss(){
		var mapShardHostIdToStats =new Map();
		shardHosts.forEach((shardHost)=>{
			if(!mapShardHostIdToStats.has(shardHost.getHostId()))
				mapShardHostIdToStats.set(shardHost.getHostId(), {nUsers:0, shardHost:shardHost});
		});
		shards.forEach((shard)=>{
			var shardHostStats;
			shardHostStats = mapShardHostIdToStats.get(shard.getHostId());
			shardHostStats.nUsers+= shard.getUserIdToExclusive()-shard.getUserIdFromInclusive();
		});
		return Array.from(mapShardHostIdToStats.values()).select(shardHostStats=>new ShardHostStats(shardHostStats)).toList();
	}
})();