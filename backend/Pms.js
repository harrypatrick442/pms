const S = require('strings').S;
module.exports = new(function(){
	const Shards = require('./Shards');
	const Client = require('client');
	const UsersRouter= Client.UsersRouter;
	var users,initialized = false,initializing=false;
	this.initialize = function(params){
		return new Promise((resolve, reject)=>{
			if(initialized)throw new Error('Already initialized');
			if(initializing)throw new Error('Is already in process of initializing');
			params.sendToDevices = sendToDevices;
			initializing=true;
			Shards.initialize(params).then(()=>{
				users = params.users;
				UsersRouter.addMessageCallback(S.PMS, incomingPms);
				initialized = true;
				initializing=false;
				resolve();
			}).catch((err)=>{initializing=false; reject(err);});
		});
	};
	this.get = function(userIdFrom, userIdTo, n, fromInclusive, toExclusive){
		return new Promise((resolve, reject)=>{
			checkInitialized();
			//if(fromInclusive===null||fromInclusive===undefined)throw new Error('fromInclusive must be a valid date');
			Shards.getShardForUserIds(userIdFrom, userIdTo).then((shard)=>{
				console.log('n is: ');
				console.log(n);
				shard.get(userIdFrom, userIdTo, n, fromInclusive, toExclusive).then(resolve).catch(reject);
			}).catch(reject);
		});
	};
	this.add = function(message, userIdFrom, userIdTo){
		return new Promise((resolve, reject)=>{
			checkInitialized();
			console.log(message);
			Shards.getShardForUserIds(userIdFrom, userIdTo).then((shard)=>{
				console.log(shard.toJSON());
				shard.add(message);
				resolve();
			}).catch(reject);
		});
	};
	function checkInitialized(){
		if(!initialized)throw new Error('Not Initialized');
	}
	function sendToDevices(messages){
		var mapUserIdToMessages = new Map();
		messages.forEach((message)=>{
			sendToDevices_mapUserIdToMessage(mapUserIdToMessages, message[S.USER_ID_FROM], message);
			sendToDevices_mapUserIdToMessage(mapUserIdToMessages, message[S.USER_ID_TO], message);
		});
		mapUserIdToMessages.forEach((messages, userId)=>{
			UsersRouter.sendToServersWith(userId, {[S.TYPE]:S.PMS, [S.USER_ID]:userId, [S.MESSAGES]:messages});
		});
	}
	function sendToDevices_mapUserIdToMessage(mapUserIdToMessages, userId, message){
		if(!mapUserIdToMessages.has())
			mapUserIdToMessages.set(userId,[message]);
		else 
			mapUserIdToMessages.get(userId).push(message);
	}
	function incomingPms(msg, channel){
		var userId = msg[S.USER_ID];
		sendPmsToUser(userId, msg);
	}
	function sendPmsToUser(userId, msg){
		var user = users.getById(userId);
		if(!user)return;
		user.getDevices().sendMessage(msg);
	}
})();