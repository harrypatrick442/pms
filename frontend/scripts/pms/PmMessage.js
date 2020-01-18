var PmMessage = function(params){
	this[S.GET_CLIENT_ASSIGNED_UUID]=function(){
		return params[S.CLIENT_ASSIGNED_UUID];
	};
	this[S.GET_CONTENT]=function(){
		return params[S.CONTENT];
	};
	this[S.GET_SENT_AT]=function(){
		return params[S.SENT_AT];
	};
	this[S.GET_FROM]=function(){
		return params[S.FROM];
	};
};