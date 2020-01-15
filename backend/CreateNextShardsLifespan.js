const Core = require('core');
const Iterator = Core.Iterator;
module.exports = function (createNextShardsCallback, userIdHighest){
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
		}
	};
	this.doRejects = function(err){
		list.forEach((createNextShardsCallback)=>{
			createNextShardsCallback.reject(err);
		});
		list = null;//be safe just incase
	};
};