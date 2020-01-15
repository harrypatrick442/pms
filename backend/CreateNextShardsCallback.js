module.exports = function(resolve, reject, userIdHighest){
	this.getUserIdHighest = function(){return userIdHighest;};
	this.resolve = function(shard){
		console.log('resolving');
		resolve(shard);
	};
	this.reject = function(err){
		reject(err);
	};
};