var PmWindowView = (function(){
	return function(params){
		var self = this;
		var model = params[S.MODEL];
		var buttonClose = new Button({
			[S.CLASS_NAME]:'close',
			[S.METHOD_NAME_CLICK]: S.CLOSE
		});
		var element = E.DIV();
		element.classList.add('pm-window');
		var inner = E.DIV();
		inner.classList.add('pm-window-inner');
		var heading = E.DIV();
		heading.classList.add('heading');
		element.appendChild(inner);
		var propertyBindingExpanded = PropertyBinding[S.STANDARD](this, model, S.EXPANDED, expandedChanged);
		
		var buttonHeading = new Button({
			[S.CLASS_NAME]:'tab',
			[S.METHOD_NAME_CLICK]: S.CLICKED_HEADING,
			[S.MODEL]:model
		});
		var buttonHeadingElement = buttonHeading[S.GET_ELEMENT]();
		var buttonClose = new Button({
			[S.CLASS_NAME]:'close',
			[S.IMAGE_SEMANTIC]:S.PM_WINDOW_CLOSE_ICON,
			[S.IMAGE_SEMANTIC_HOVER]:S.PM_WINDOW_CLOSE_ICON_HOVER,
			[S.METHOD_NAME_CLICK]: S.CLOSE,
			[S.MODEL]:model
		});
		var multimediaEntryViewHeading = new MultimediaEntryView({
			[S.MODEL]:model,
			[S.SEMANTIC_DEFAULT]:S.PMS_ENTRY_PICTURE_DEFAULT
		});
		var textBlockTitle = new TextBlock({
			[S.PROPERTY_NAME]: S.TITLE,
			[S.CLASS_NAME]:'title',
			[S.MODEL]:model
		});
		var pmView = new PmView({
			[S.MODEL]:model
		});
		var multimediaEntryViewHeadingElement = multimediaEntryViewHeading[S.GET_ELEMENT]();
		buttonHeadingElement.appendChild(multimediaEntryViewHeadingElement);
		buttonHeadingElement.appendChild(textBlockTitle[S.GET_ELEMENT]());
		buttonHeadingElement.appendChild(buttonClose[S.GET_ELEMENT]());
		inner.appendChild(buttonHeadingElement);
		inner.appendChild(pmView[S.GET_ELEMENT]());
		
		this[S.GET_ELEMENT]=function(){return element;};
		this[S.DISPOSE]=function(){
			self[S.MY_BINDINGS][S.DISPOSE]();
			pmView[S.DISPOSE]();
		};
		function expandedChanged(value){
			if(value)element.classList.add('expanded');
			else element.classList.remove('expanded');
		}
	};
})();