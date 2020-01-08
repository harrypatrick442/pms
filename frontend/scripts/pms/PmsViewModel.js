var PmsViewModel = function(params){
	var MAX_N_OPEN =5;//open means a window view of the conversation
	var MAX_N_ENTRIES =30;//entries listed in the pms list
	var bindingsHandler = BindingsHandlerBuilder(this);
	var self = this;
	var getSessionId = params[S.GET_SESSION_ID];
	var ticketedSend = params[S.TICKETED_SEND];
	var model = params[S.MODEL];
	var changed = bindingsHandler[S.CHANGED];
	var displayMode=PmsDisplayModes.WIDE;
	var searchText='',nOnline=0;
	var conversationVisible = false;
	var propertyBindingEntries = PropertyBinding[S.CARRY_OVER_MODEL_ARRAY_AS_VIEW_MODEL_ARRAY](this, model, S.ENTRIES, function(model){
		return new PmsEntryViewModel({[S.MODEL]:model});
	}, function(pmsEntryViewModel, old){
	});
	var propertyBindingOpen = PropertyBinding[S.CARRY_OVER_MODEL_ARRAY_AS_VIEW_MODEL_ARRAY](this, model, S.OPEN, function(model){
		return new PmViewModel({[S.MODEL]:model,
			[S.TICKETED_SEND]:ticketedSend,
			[S.GET_SESSION_ID]:getSessionId
		});
	}, function(pmsEntryViewModel, old){
	});
	var propertyBindingEntriesSource = propertyBindingEntries[S.GET_SOURCE]();
	var propertyBindingOpenSource = propertyBindingOpen[S.GET_SOURCE]();
	PropertyBinding[S.CARRY_OVER](this, model, [S.VISIBLE, S.EXPANDED]);
	var propertyBindingExpanded = PropertyBinding[S.STANDARD](this, model, S.EXPANDED, expandedChanged, true);
	updateExpanded();
	this[S.GET_UNEXPANDED]=getUnexpanded;
	this[S.GET_UNEXPANDED_AND_WIDE]=getUnexpandedAndWide;
	this[S.GET_UNEXPANDED_TEXT]=function(){
		return '1';
	};
	this[S.GET_ONLINE_TEXT]=getOnlineText;
	this[S.GET_ONLINE_TEXT_BRACKETED]=getOnlineTextBracketed;
	this[S.CLICKED_EXPANDED_HEADING]=function(){model[S.SET_EXPANDED](false);};
	this[S.CLICKED_UNEXPANDED]=function(){model[S.SET_EXPANDED](true);};
	this[S.GET_ENTRIES_VISIBLE]=getEntriesVisible;
	this[S.GET_OPEN_VISIBLE]=getOpenVisible;
	this[S.HIDE]=function(){model[S.SET_VISIBLE](false);};
	this[S.GET_NARROW]=getNarrow;
	this[S.GET_WIDE]=getWide;
	this[S.SHOW]=show;
	this[S.GET_DISPLAY_MODE]=function(){ return displayMode;};
	this[S.SET_DISPLAY_MODE]=function(value){
		displayMode = value; 
		changed(S.DISPLAY_MODE, value);
		changed(S.NARROW, getNarrow());
		changed(S.WIDE, getWide());
		updateUnexpandedAndWide();
		updateOpenVisible();
		updateEntriesVisible();
	};
	this[S.CLOSE_OPENS]=function(toCloseViewModels){
		removeAllFromOpen(toCloseViewModels[S.SELECT](function(viewModel){
			return viewModel[S.GET_MODEL]();
		})[S.TO_LIST]());
	};
	this[S.GET_SEARCH_TEXT]=function(){
		return searchText;
	};
	this[S.SET_SEARCH_TEXT]=function(value){
		searchText = value;
		changed(S.SEARCH_TEXT, value);	
	};
	this[S.OPEN_TO]=function(params){
		var userId = params[S.USER_ID];
		if(!userId)throw new Error('No userId');
		var entry = getPmByUserId(userId);
		if(!entry){
			entry = new Pm(params);
		}
		entry[S.SET_EXPANDED](true);
		show();
		   //setExpanded(true);
		addToEntries(entry);
		addToOpen(entry);
		setConversationVisible(true);
	};
	function setConversationVisible(value){
		conversationVisible = value;
		changed(S.CONVERSATION_VISIBLE, value);
		updateEntriesVisible();
		updateOpenVisible();
	}
	function getConversationVisible(){
		return conversationVisible;
	}
	function getOpenVisible(){
			return getNarrow()&&getExpanded()&& getConversationVisible();
	}
	function getEntriesVisible(){
		return (getExpanded()&&getWide() )||(getNarrow()&&!getConversationVisible());
	}
	function getOnlineTextBracketed(){
		return '('+getOnlineText()+')';
	}
	function getOnlineText(){
		return String(nOnline)+' online';
	}
	function updateNOnline(value){
		nOnline = value;
		changed(S.ONLINE_TEXT, getOnlineText());
		changed(S.ONLINE_TEXT_BRACKETED, getOnlineTextBracketed());
	}
	function updateEntriesVisible(){
		changed(S.ENTRIES_VISIBLE, getEntriesVisible());
	}
	function updateOpenVisible(){
		changed(S.OPEN_VISIBLE, getOpenVisible());
	}
	function show(){ model[S.SET_VISIBLE](true);}
	function addToEntries(pm){
		var entries = getEntriesModels();
		var index = entries.indexOf(pm);
		if(index===0)return;
		if(index>0)entries.splice(index);
		entries.splice(0, 0, pm);
		console.log(entries);
		setEntriesModels(entries);
	}
	function addToOpen(pm){
		var entries = getOpenModels();
		var index = entries.indexOf(pm);
		if(index===0)return;
		if(index>0)entries.splice(index);
		entries.splice(0, 0, pm);
		overflowOpenModels(entries);
		setOpenModels(entries);
	}
	function overflowOpenModels(entries){
		var nToDropOffEnd = entries.length-MAX_N_OPEN;
		if(nToDropOffEnd>0){
			entries.splice(entries.length-nToDropOffEnd, nToDropOffEnd);
		}
	}
	function overflowEntriesModels(entries){
		var nToDropOffEnd = entries.length-MAX_N_ENTRIES;
		if(nToDropOffEnd>0){
			var removedFromEntries = entries.splice(entries.length-nToDropOffEnd, nToDropOffEnd);
			removeAllFromOpen(removedFromEntries);
		}
	}
	function removeAllFromOpen(removedFromEntries){
		var opens = getOpenModels();
		each(removedFromEntries, function(entry){
			var index = opens.indexOf(entry);
			if(index>=0)opens.splice(index, 1);
		});
		setOpenModels(opens);
	}
	function getPmByUserId(userId){
		return getEntriesModels()[S.WHERE](function(entry){
			return entry[S.GET_USER_ID]()===userId
		})[S.FIRST_OR_DEFAULT]();
	}
	function getEntriesModels(){
		return propertyBindingEntriesSource[S.GET]();
	}
	function setEntriesModels(entries){
		return propertyBindingEntriesSource[S.SET](entries);
	}
	function getOpenModels(){
		return propertyBindingOpenSource[S.GET]();
	}
	function setOpenModels(entries){
		return propertyBindingOpenSource[S.SET](entries);
	}
	function getUnexpanded(){
		return !getExpanded();
	}
	function getExpanded(){
		return propertyBindingExpanded[S.GET]();
	}
	function setExpanded(value){
		propertyBindingExpanded[S.SET](value);
	}
	function getNarrow(){
		return displayMode===PmsDisplayModes.NARROW;
	}
	function getWide(){
		return displayMode===PmsDisplayModes.WIDE;
	}
	function getUnexpandedAndWide(unexpanded){
		return getUnexpanded()&&!getNarrow();
	}
	function expandedChanged(value){
		updateExpanded(value);
		updateOpenVisible();
		updateEntriesVisible();
	}
	function updateExpanded(value){
		if(value===undefined)value=getUnexpanded();
		changed(S.UNEXPANDED, !value);
		updateUnexpandedAndWide();
	}
	function updateUnexpandedAndWide(unexpanded){
		if(unexpanded===undefined)unexpanded=getUnexpanded();
		changed(S.UNEXPANDED_AND_WIDE, getUnexpandedAndWide());
	}
};