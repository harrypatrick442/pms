module.exports = new(function(){
	const Pms = require('./Pms');
	const Core = require('core');
	const S = require('strings').S;
	const getTime = Core.getTime;
	const PmsLog = require('./PmsLog');
	this.incoming = function(req, userIdFrom, callback){
		console.log('incoming');
		console.log(req);
		switch(req[S.PMS_TYPE]){
			case S.GET:
				Pms.get(userIdFrom, req[S.USER_ID], req[S.FROM_INCLUSIVE], req[S.TO_EXCLUSIVE]).then((messages)=>{
					callback({[S.TICKET]:req[S.TICKET], [S.SUCCESSFUL]:true, [S.MESSAGES]:messages});
				}).catch((err)=>{
					PmsLog.error(err);
					callback({[S.TICKET]:req[S.TICKET], [S.SUCCESSFUL]:false});
				});
			break
			case S.ADD:
				console.log(req);
				var userIdTo = parseInt(req[S.USER_ID]);
				Pms.add({[S.USER_ID_FROM]:parseInt(userIdFrom), [S.USER_ID_TO]:userIdTo, [S.SENT_AT]:getTime(), [S.CONTENT]:req[S.CONTENT]}, userIdFrom, userIdTo)
				.then(()=>{
					callback({[S.TICKET]:req[S.TICKET], [S.SUCCESSFUL]:true });
				})
				.catch((err)=>{
					PmsLog.error(err);
					callback({[S.TICKET]:req[S.TICKET], [S.SUCCESSFUL]:false});
				});
			break;
		}
	};
	
})();