module.exports = new(function(){
	const Pms = require('./Pms');
	const Core = require('core');
	const S = require('strings').S;
	const getTime = Core.getTime;
	const PmsLog = require('./PmsLog');
	this.incoming = function(req, userIdFrom, callback){
		console.log(req);
		switch(req[S.PMS_TYPE]){
			case S.GET:
				var userIdTo = parseInt(req[S.USER_ID]);
				Pms.get(userIdFrom, userIdTo, req[S.N], req[S.FROM_INCLUSIVE], req[S.TO_EXCLUSIVE]).then((messages)=>{
					callback({[S.TICKET]:req[S.TICKET], [S.SUCCESSFUL]:true, [S.MESSAGES]:messages});
				}).catch((err)=>{
					PmsLog.error(err);
					callback({[S.TICKET]:req[S.TICKET], [S.SUCCESSFUL]:false});
				});
			break
			case S.ADD:
				var message = req[S.MESSAGE];
				var userIdTo = parseInt(message[S.USER_ID_TO]);
				message[S.USER_ID_FROM]=userIdFrom;
				message[S.SENT_AT]=new Date();
				Pms.add(message, userIdFrom, userIdTo)
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