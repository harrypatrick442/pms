var Pm = function(params){
	var userId = params[S.USER_ID], username = params[S.USERNAME];
	if(!userId)throw new Error('No userId provided');
	if(!username)throw new Error('No username provided');
	var bindingsHandler = BindingsHandlerBuilder(this);
	var changed = bindingsHandler[S.CHANGED];
	var self = this;
	setDefaults(params);
	this[S.GET_USERNAME]=function(){
		return username;
	};
	this[S.GET_USER_ID]=function(){
		return userId;
	};
	this[S.GET_MESSAGES]=function(){
		return params[S.MESSAGES];
	};
	this[S.SET_MESSAGES]=function(value){
		params[S.MESSAGES]=value;
		changed(S.MESSAGES, value);
	};
	this[S.GET_REACHED_FIRST]=function(){
		return params[S.REACHED_FIRST];
	};
	this[S.SET_REACHED_FIRST]=function(value){
		params[S.REACHED_FIRST]=value;
		changed(S.REACHED_FIRST, value);
	};
	function setDefaults(params){
		if(!params[S.MESSAGES])params[S.MESSAGES]=[];
	}
};