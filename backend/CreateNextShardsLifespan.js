const Core = require('core');
const Iterator = Core.Iterator;
module.exports = function (createNextShardsCallback, userIdHighest){
	var list =[createNextShardsCallback];
	this.updateHighestUserId=function(newUserIdHighest){
		if(newUserIdHighest<=userIdHighest)return;
		userIdHighest = newUserIdHighest;
	};
	this.getNCallbacksLeft=function(){
		return list.length;
	};
	this.getUserIdHighest = function(){return userIdHighest;};
	this.add = function(createNextShardsCallback){
		list.push(createNextShardsCallback);
	};
	this.doResolves = function(shard, userIdFromInclusive, userIdToExclusive){
		var iterator = new Iterator(list);
		console.log('doing resolves for');
		console.log(userIdFromInclusive);
		console.log(userIdToExclusive);
		while(iterator.hasNext()){
			var createNextShardsCallback = iterator.next();
			var userIdHighest = createNextShardsCallback.getUserIdHighest();
			console.log(userIdHighest);
			console.log('is uer id highest')
			if(userIdHighest<userIdFromInclusive||userIdHighest>=userIdToExclusive)continue;
			iterator.remove();
			createNextShardsCallback.resolve(shard);
		}
	};
	this.doRejects = function(err){
		list.forEach((createNextShardsCallback)=>{
			createNextShardsCallback.reject(err);
		});
		list = null;//be safe just incase
	};
};