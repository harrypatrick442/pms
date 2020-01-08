module.exports = (function(params){
	var _settings;
	function Settings(){
		this.getHostIdShardCreator = function(){
			return params.hostIdShardCreator;
		};
	}
	this.get = function(){
		return new Promise((resolve, reject)=>{
			if(_settings){resolve(_settings);return;}
			DalPms.getSettings().then((settings)=>{
				_settings = settings;
				resolve(settings);
			}).catch(reject);
		});
	});
})();