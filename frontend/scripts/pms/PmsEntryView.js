var PmsEntryView = (function(){
	return function(params){
		var model = params[S.MODEL];
		var self = this;
		var element = E.DIV();
		element.classList.add('pms-entry');
		this[S.GET_ELEMENT]=function(){return element;};
	};
})();