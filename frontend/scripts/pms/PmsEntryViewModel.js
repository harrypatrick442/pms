var PmsEntryViewModel = function(params){
	var bindingsHandler = BindingsHandlerBuilder(this);
	var self = this;
	var changed = bindingsHandler[S.CHANGED];
	var model = params[S.MODEL];
	var width;
	this[S.MINIMISE]=function(){
		
	};
	this[S.CLOSE]=function(){
		
	};
	this[S.DISPOSE]=function(){
		self[S.MY_BINDINGS][S.DISPOSE]();
	};
	this[S.GET_READ_ONLY]=function(){
		return true;
	};
	this[S.GET_IS_VIDEO]=function(){return false;};
	var _urlProvider;
	function getUrlProvider(minWidth){
		var multimediaEntry = model[S.GET_MULTIMEDIA_ENTRY]();
		if(!_urlProvider&&multimediaEntry){
			console.log(model);
			_urlProvider = MultimediaHelper[S.GET_MULTIMEDIA_URL_PROVIDER](multimediaEntry, minWidth, MultimediaUrlTypes.THUMBNAIL_STATIC);
		}
		return _urlProvider;
	}
	this[S.GET_NEXT_THUMBNAIL_URL]=function(){
		var urlProvider = getUrlProvider();
		var url =urlProvider?urlProvider[S.GET_NEXT_BEST]():null;
		return url;
	};
	this[S.GET_THUMBNAIL_URL]=function(){
		var urlProvider = getUrlProvider();
		var url =urlProvider?urlProvider[S.GET_CURRENT]():null;
		return url;
	};
};