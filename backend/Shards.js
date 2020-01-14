module.exports = new(function(){
	var initialized= false;
	const Settings = require('./Settings');
	const Core = require('core');
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
	var PmsLog = require('./PmsLog');
	var shards, shardsCreator,createNextShardsLifespan, shardHosts, mapIdToShard={};
	this.initialize = initialize;
	this.getShardForUserIds=function(userId1, userId2){
		return new Promise((resolve, reject)=>{
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
								mapIdToShard[shard.getId()]=shard;
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
		if(!initialized){
			error('Not Initialized');
			return;
		}
		console.log('createNextShardFromRemote');
		var userIdHighest = msg.userIdHighest;
		var myNextUserIdFromInclusive = msg.myNextUserIdFromInclusive;
		var localUserIdToExclusive = getNextShardUserIdFromInclusive()-1;
		console.log(userIdHighest);
		console.log(myNextUserIdFromInclusive);
		console.log(localUserIdToExclusive);
		if(localUserIdToExclusive<=userIdHighest){;
		console.log('localUserIdToExclusive<=userIdHighest');
			createNextShardsWithMeAsShardCreator(userIdHighest).then((newShardForUserIdHighest)=>{
				sendShardsUsingChannel(getShardsInRange(myNextUserIdFromInclusive, userIdHighes+1, true), channel);
			}).catch(error);
			return;
		}
		console.log('sendShardsUsingChannel');
		sendShardsUsingChannel(getShardsInRange(myNextUserIdFromInclusive, userIdHighest+1, true), channel);
		function error(err){
			PmsLog.error(err);
			channel.send({
				ticket:msg.ticket,
				successful:false
			});
		}
	}
	function sendShardUsingChannel(shard, channel){
		channel.send({
			ticket:msg.ticket,
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
			shardHostStats = mapShardHostIdToStats.get(shard);
			shardHostStats.nUsers+= shard.getUserIdToExclusive()-shard.getUserIdFromInclusive();
		});
		return Array.from(mapShardHostIdToStats.values()).select(shardHostStats=>new ShardHostStats(shardHostStats)).toList();
	}
})();