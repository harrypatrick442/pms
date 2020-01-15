const S = require('strings').S;
module.exports = new(function(){ 
	const DalPms = require('./DalPms');
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
				initialized = true;
				initializing=false;
				resolve();
			}).catch((err)=>{initializing=false; reject(err);});
		});
	};
	this.get = function(userIdFrom, userIdTo, fromInclusive, toInclusive){
		return new Promise((resolve, reject)=>{
			checkInitialized();
			Shards.getShardForUserIds(userIdFrom, userIdTo).then((shard)=>{
				console.log(shard.toJSON());
			}).catch(reject);
		});
	};
	this.add = function(){
		checkInitialized();
		
	};function checkInitialized(){
		if(!initialized)throw new Error('Not Initialized');
	}
	function sendToDevices(messages){
		var mapUserIdToMessages = new Map();
		messages.forEach((message)=>{
			sendToDevices_mapUserIdToMessage(mapUserIdToMessages, message[S.USER_ID_FROM], message);
			sendToDevices_mapUserIdToMessage(mapUserIdToMessages, message[S.USER_ID_TO], message);
		});
		var usersRouter = UsersRouter.get();
		mapUserIdToMessages.forEach((messages, userId)=>{
			userRouter.sendToServersWith(userId, {[S.TYPE]:S.PMS, [S.MESSAGES]:messages});
		});
	}
	function sendToDevices_mapUserIdToMessage(mapUserIdToMessages, userId, message){
		if(!mapUserIdToMessages.has())
			mapUserIdToMessages.set(userId,[message]);
		else 
			mapUserIdToMessages.get(userId).push(message);
	}
})();