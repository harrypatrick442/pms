module.exports = new (function(){
	var log = new Log({printToConsole:true, path:'/pms.log'});
	this.error = log.error;
	this.warn = log.warn;
	this.info = log.info;
})();