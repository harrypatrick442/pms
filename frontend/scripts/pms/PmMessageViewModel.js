var PmMessageViewModel = function(params){
	var model = params[S.MODEL];
	var userId = params[S.USER_ID];
	this[S.GET_CLIENT_ASSIGNED_UUID]=model[S.GET_CLIENT_ASSIGNED_UUID];
	this[S.GET_CONTENT]=model[S.GET_CONTENT];
	this[S.GET_SENT_AT]=model[S.GET_SENT_AT];
	this[S.GET_FROM]=model[S.GET_FROM];
	this[S.GET_IS_ME]=function(){
		return false&&userId==model[S.GET_FROM]();
	};
};