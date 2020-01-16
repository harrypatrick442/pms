var PmViewModel = function(params){
	var TIMEOUT_SEND_ADD =5000;
	var bindingsHandler = BindingsHandlerBuilder(this);
	var self = this;
	var getSessionId = params[S.GET_SESSION_ID];
	var ticketedSend = params[S.TICKETED_SEND];
	var changed = bindingsHandler[S.CHANGED];
	var model = params[S.MODEL];
	var width, typeBoxText= '', typeBoxDisabled=false;
	var propertyBindingExpanded = PropertyBinding[S.CARRY_OVER]( this, model, S.EXPANDED);
	this[S.CLICKED_HEADING]=function(){
		setExpanded(!getExpanded());
	};
	this[S.GET_MODEL]=function(){
		return model;
	};
	this[S.DISPOSE]=function(){
		self[S.MY_BINDINGS][S.DISPOSE]();
	};
	function getExpanded(){
		return propertyBindingExpanded[S.GET]();
	}
	function setExpanded(value){ console.log(value);
		propertyBindingExpanded[S.SET](value);
	}
	this[S.GET_READ_ONLY]=function(){
		return true;
	};
	this[S.GET_MESSAGES]=function(){
		return [];
	};
	this[S.GET_TYPE_BOX_TEXT]=getTypeBoxText;
	this[S.SET_TYPE_BOX_TEXT]=setTypeBoxText;
	this[S.GET_TYPE_BOX_DISABLED]=function(){
		return typeBoxDisabled;
	};
	this[S.GET_IS_VIDEO]=function(){return false;};
	this[S.ON_ENTER]=function(){
		setTypeBoxDisabled(true);
		addPm(getTypeBoxText()).then(function(){
			setTypeBoxText('');
			setTypeBoxDisabled(false);
		}).catch(function(){
			setTypeBoxDisabled(false);
		});
	};
	PropertyBinding[S.CARRY_OVER](this, model, S.USERNAME, S.TITLE);
	var _urlProvider;
	getPms();
	function setTypeBoxText(value){
		if(value.length>640)value = value.substr(0,640);
		typeBoxText = value;
		changed(S.TYPE_BOX_TEXT, value);
	}
	function getTypeBoxText(){
		return typeBoxText;
	}
	function setTypeBoxDisabled(value){
		typeBoxDisabled = value;
		changed(S.TYPE_BOX_DISABLED, value);
	}
	function getUrlProvider(minWidth){
		var multimediaEntry = model[S.GET_MULTIMEDIA_ENTRY]();										
		if(!_urlProvider&&multimediaEntry){
			console.log(model);
			_urlProvider = MultimediaHelper[S.GET_MULTIMEDIA_URL_PROVIDER](multimediaEntry, minWidth, MultimediaUrlTypes.THUMBNAIL_STATIC);
		}
		return _urlProvider;
	}
	this[S.GET_NEXT_THUMBNAIL_URL]=function(){
		console.log('GET_NEXT_THUMBNAIL_URL');
		var urlProvider = getUrlProvider();
		var url =urlProvider?urlProvider[S.GET_NEXT_BEST]():null;
		return url;
	};
	this[S.GET_THUMBNAIL_URL]=function(){
		console.log('GET_THUMBNAIL_URL');
		var urlProvider = getUrlProvider();
		var url =urlProvider?urlProvider[S.GET_CURRENT]():null;
		return url;
	};
	function getPms(toInclusive){
		ticketedSend[S.SEND]({
			[S.TYPE]:S.PMS,
			[S.PMS_TYPE]:S.GET,
			[S.TO_INCLUSIVE]:toInclusive,
			[S.SESSION_ID]:getSessionId(),
			[S.USER_ID]:model[S.GET_USER_ID]()
		}, function(res){
			console.log(res);
		},function(){
			
		});
	}
	function addPm(content){
		return new Promise(function(resolve, reject){
			console.log(content);
			ticketedSend[S.SEND]({
				[S.TYPE]:S.PMS,
				[S.PMS_TYPE]:S.ADD,
				[S.CONTENT]:content,
				[S.SESSION_ID]:getSessionId(),
				[S.CLIENT_ASSIGNED_UUID]:getClientAssignedUuid(),
				[S.USER_ID]:model[S.GET_USER_ID]()
			},resolve,reject, TIMEOUT_SEND_ADD);
		});
	}
	function getClientAssignedUuid(){
		return UUID[S.V_4]();
	}
};