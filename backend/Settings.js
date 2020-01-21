function Settings(params){
	console.log(params);
	this.getHostIdShardCreator = function(){
		return params.hostIdShardCreator;
	}; 
	this.getShardSize = function(){
		return params.shardSize;
	}; 
	this.getMaxNShardsCreateAtOnce=function(){
		return params.maxNShardsCreateAtOnce;
	};
	this.getAccumulatorMaxNMessages=function(){
		return params.accumulatorMaxNMessages;
	};
	this.getAccumulatorMaxTotalWait=function(){
		return params.accumulatorMaxTotalWait;
	};
	this.getAccumulatorMaxWaitBetweenMessages=function(){
		return params.accumulatorMaxWaitBetweenMessages;
	};
}
Settings.fromSqlRow = function(row){
	return new Settings(row);
};
module.exports = Settings;