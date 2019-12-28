var Pms = function(params){
	var bindingsHandler = BindingsHandlerBuilder(this);
	var changed = bindingsHandler[S.CHANGED];
	var self = this;
	var entries = params[S.ENTRIES]?params[S.ENTRIES][S.SELECT](function(entry){return new Pm(entry);})[S.TO_LIST]():[];
	var open = initializeOpen();
	this[S.GET_ENTRIES]=function(){
		return entries;
	};
	this[S.SET_ENTRIES]=function(value){
		entries = value;
		changed(S.ENTRIES, value);
		console.log(value);
	};
	this[S.GET_OPEN]=function(){
		return open;
	};
	this[S.SET_OPEN]=function(value){
		open = value;
		changed(S.OPEN, value);
		console.log(value);
	};
	this[S.GET_VISIBLE]=function(){
		return params[S.VISIBLE];
	};
	this[S.SET_VISIBLE]=function(value){
		params[S.VISIBLE]=value;
		changed(S.VISIBLE, value);
	};
	this[S.GET_EXPANDED]=function(){
		return params[S.EXPANDED];
	};
	this[S.SET_EXPANDED]=setExpanded;
	function initializeOpen(){
		if(!params[S.OPEN])return [];
		var arr=[];
		each(params[S.OPEN], function(entry){
			var pm = getPmByUserId(entry[S.USER_ID]);
			if(pm)arr.push(pm);
		});
		return arr;
	}
	function getPmByUserId(userId){
		return entries[S.WHERE](function(entry){ return entry[S.USER_ID]===userId;})[S.FIRST_OR_DEFAULT]();
	}
	function setExpanded(value){
		params[S.EXPANDED]=value;
		changed(S.EXPANDED, value);
	};
};