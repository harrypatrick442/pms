module.exports = new (function(){
	var _settings;
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
	this.get = function(){
		return new Promise((resolve, reject)=>{
			if(_settings){resolve(_settings);return;}
			require('./DalPms').getSettings().then((settings)=>{
				_settings = settings;
				resolve(settings);
			}).catch(reject);
		});
	};
	this.fromSqlRow = function(row){
		return new Settings(row);
	};
})();