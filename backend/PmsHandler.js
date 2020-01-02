module.exports = new(function(){
	const Pms = require('./Pms');
	const Core = require('core');
	const getTime = Core.getTime;
	const PmsLog = require('./PmsLog');
	this.incoming = function(req, userIdFrom, callback){
		console.log(req);
		switch(req[S.PMS_TYPE]){
			case [S.GET]:
				Pms.get(userIdFrom, req[S.USER_ID], req[S.FROM_INCLUSIVE], req[S.TO_EXCLUSIVE]).then((messages)=>{
					callback({[S.TICKET]:req[S.TICKET], [S.SUCCESSFUL]:true, [S.MESSAGES]:messages});
				}).catch((err)=>{
					PmsLog.error(err);
					callback({[S.TICKET]:req[S.TICKET], [S.SUCCESSFUL]:false});
				});
			break
			case [S.ADD]:
				Pms.add({userIdFrom:userIdFrom, userIdTo:req[S.USER_ID_TO], sentAt:getTime(), content:req[S.CONTENT]});
			break;
		}
	};
})();