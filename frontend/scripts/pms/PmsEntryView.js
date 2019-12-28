var PmsEntryView = (function(){
	return function(params){
		var model = params[S.MODEL];
		var self = this;
		var element = E.DIV();
		element.classList.add('pms-entry');
		var multimediaEntryView = new MultimediaEntryView({
			[S.MODEL]:model,
			[S.SEMANTIC_DEFAULT]:S.PMS_ENTRY_PICTURE_DEFAULT
		});
		var multimediaEntryViewElement = multimediaEntryView[S.GET_ELEMENT]();
		element.appendChild(multimediaEntryViewElement);
		this[S.GET_ELEMENT]=function(){return element;};
	};
})();	