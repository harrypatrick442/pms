module.exports = (function(){
	var _settings;
	function Settings(){
		this.getSharsUser = function(){
			return params.shardsUser;
		};
		this.getHostIdShardCreator = function(){
			return params.hostIdShardCreator;
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
	});
	this.fromSqlRow = function(row){
		return new Settings(row);
	};
})();