var Pms = function(params){
	var bindingsHandler = BindingsHandlerBuilder(this);
	var changed = bindingsHandler[S.CHANGED];
	var self = this;
	var entries = params[S.ENTRIES]?params[S.ENTRIES][S.SELECT](function(entry){return new PmsEntryViewModel(entry);})[S.TO_LIST]():[];
	var pms = params[S.PMS]?params[S.PMS][S.SELECT](function(pm){return new PmViewModel(pm);})[S.TO_LIST]():[];
	this[S.GET_ENTRIES]=function(){
		return entries;
	};
	this[S.SET_ENTRIES]=function(value){
		entries = value;
		params[S.ENTRIES]=value[S.GET_PARAMS]();
		changed(S.ENTRIES, value);
	};
	this[S.GET_PMS]=function(){
		return pms;
	};
	this[S.SET_PMS]=function(value){
		pms = value;
		params[S.PMS]=value[S.GET_PARAMS]();
		changed(S.PMS, value);
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
	function setExpanded(value){
		params[S.EXPANDED]=value;
		changed(S.EXPANDED, value);
	};
};