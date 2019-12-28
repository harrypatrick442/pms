var PmWindowView = (function(){
	return function(params){
		var self = this;
		var model = params[S.MODEL];
		var buttonClose = new Button({
			[S.CLASS_NAME]:'close',
			[S.METHOD_NAME_CLICK]: S.CLOSE
		});
		var element = E.DIV();
		element.classList.add('pm');
		var inner = E.DIV();
		inner.classList.add('inner');
		var heading = E.DIV();
		heading.classList.add('heading');
		element.appendChild(inner);
		var propertyBindingExpanded = PropertyBinding[S.STANDARD](this, model, S.EXPANDED, expandedChanged);
		
		var buttonHeading = new Button({
			[S.CLASS_NAME]:'tab',
			[S.METHOD_NAME_CLICK]: S.CLICKED_UNEXPANDED,
			[S.MODEL]:model
		});
		var buttonHeadingElement = buttonHeading[S.GET_ELEMENT]();
		var multimediaEntryViewHeading = new MultimediaEntryView({
			[S.MODEL]:model,
			[S.SEMANTIC_DEFAULT]:S.PMS_ENTRY_PICTURE_DEFAULT
		});
		var multimediaEntryViewHeadingElement = multimediaEntryViewHeading[S.GET_ELEMENT]();
		buttonHeadingElement.appendChild(multimediaEntryViewHeadingElement);
		inner.appendChild(buttonHeadingElement);
		
		
		this[S.GET_ELEMENT]=function(){return element;};
		this[S.DISPOSE]=function(){
			self[S.MY_BINDINGS][S.DISPOSE]();
		};
		function expandedChanged(value){
			if(value)element.classList.add('expanded');
			else element.classList.remove('expancded');
		}
	};
})();