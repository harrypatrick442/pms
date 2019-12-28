var PmsViewModel = function(params){
	var bindingsHandler = BindingsHandlerBuilder(this);
	var self = this;
	var changed = bindingsHandler[S.CHANGED];
	var model = params[S.MODEL];
	var displayMode=PmsDisplayModes.WIDE;
	PropertyBinding[S.CARRY_OVER_CHILD_MODEL_AS_CHILD_VIEW_MODEL](this, model, S.PMS, function(model){
		return new PmViewModel(model);
	}, function(pmViewModel, old){
	});
	PropertyBinding[S.CARRY_OVER_CHILD_MODEL_AS_CHILD_VIEW_MODEL](this, model, S.ENTRIES, function(model){
		return new PmsEntryViewModel(model);
	}, function(pmsEntryViewModel, old){
	});
	PropertyBinding[S.CARRY_OVER](this, model, [S.VISIBLE, S.EXPANDED]);
	var propertyBindingExpanded = PropertyBinding[S.STANDARD](this, model, S.EXPANDED, expandedChanged, true);
	updateUnexpanded();
	this[S.GET_UNEXPANDED]=getUnexpanded;
	this[S.GET_UNEXPANDED_AND_WIDE]=getUnexpandedAndWide;
	this[S.GET_UNEXPANDED_TEXT]=function(){
		return '1';
	};
	this[S.CLICKED_EXPANDED_HEADING]=function(){model[S.SET_EXPANDED](false);};
	this[S.CLICKED_UNEXPANDED]=function(){model[S.SET_EXPANDED](true);};
	this[S.HIDE]=function(){model[S.SET_VISIBLE](false);};
	this[S.GET_NARROW]=getNarrow;
	this[S.SHOW]=function(){ model[S.SET_VISIBLE](true);};
	this[S.GET_DISPLAY_MODE]=function(){ return displayMode;};
	this[S.SET_DISPLAY_MODE]=function(value){
		displayMode = value; 
		changed(S.DISPLAY_MODE, value);
		changed(S.NARROW, getNarrow());
		updateUnexpandedAndWide();
	};
	function getUnexpanded(){
		return !propertyBindingExpanded[S.GET]();
	}
	function getNarrow(){
		return displayMode===PmsDisplayModes.NARROW;
	}
	function getUnexpandedAndWide(unexpanded){
		return getUnexpanded()&&!getNarrow();
	}
	function expandedChanged(value){
		updateUnexpanded(value);
	}
	function updateUnexpanded(value){
		if(value===undefined)value=getUnexpanded();
		changed(S.UNEXPANDED, !value);
		updateUnexpandedAndWide();
	}
	function updateUnexpandedAndWide(unexpanded){
		if(unexpanded===undefined)unexpanded=getUnexpanded();
		changed(S.UNEXPANDED_AND_WIDE, getUnexpandedAndWide());
	}
};