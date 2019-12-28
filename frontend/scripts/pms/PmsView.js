var PmsView = (function(){
	return function(params){
		var model = params[S.MODEL];
		var parentElement = params[S.ELEMENT];
		var self = this;
		var buttonClose = new Button({
			[S.CLASS_NAME]:'close',
			[S.METHOD_NAME_CLICK]: S.HIDE,
			[S.MODEL]:model
		});
		var element = E.DIV();
		var popup = new Popup({[S.ELEMENT]:element, [S.PROPERTY_NAME_VISIBLE]:S.VISIBLE, [S.MODEL]:model});
		element.classList.add('pms');
		element.appendChild(buttonClose[S.GET_ELEMENT]());
		ResizeManager[S.ADD]({
			[S.ELEMENT]:document.documentElement,
			[S.ON_RESIZED]:onResize,
			[S.STAGGERED]:true
		});
		var buttonUnexpanded = new Button({
			[S.CLASS_NAME]:'unexpanded',
			[S.METHOD_NAME_CLICK]: S.CLICKED_UNEXPANDED,
			[S.MODEL]:model,
			[S.PROPERTY_NAME_VISIBLE]:S.UNEXPANDED_AND_WIDE
		});
		var imageUnexpandedMessage = new ImageControl({
			[S.SEMANTIC]:S.PMS_MESSAGE_ICON,
			[S.CLASS_NAME]:'unexpanded-message'
		});
		var imageUnexpandedMessageElement = imageUnexpandedMessage[S.GET_ELEMENT]();
		var imageUnexpandedNumberBox = new ImageControl({
			[S.SEMANTIC]:S.PMS_NUMBER_BOX_ICON,
			[S.CLASS_NAME]:'number-box'
		});
		var textNumberBox = new TextBlock({
			[S.PROPERTY_NAME]:S.UNEXPANDED_TEXT,
			[S.MODEL]:model
		})
		var buttonUnexpandedElement = buttonUnexpanded[S.GET_ELEMENT]();
		buttonUnexpandedElement.appendChild(imageUnexpandedMessage[S.GET_ELEMENT]());
		var imageUnexpandedNumberBoxElement = imageUnexpandedNumberBox[S.GET_ELEMENT]();
		imageUnexpandedNumberBoxElement.appendChild(textNumberBox[S.GET_ELEMENT]());
		buttonUnexpandedElement.appendChild(imageUnexpandedNumberBoxElement);
		var buttonExpandedHeading = new Button({
			[S.CLASS_NAME]:'expanded-heading',
			[S.METHOD_NAME_CLICK]: S.CLICKED_EXPANDED_HEADING,
			[S.MODEL]:model,
			[S.PROPERTY_NAME_VISIBLE]:S.EXPANDED
		});
		var panelHeadingNarrow = new Panel({[S.CLASS_NAME]:'heading-narrow', [S.PROPERTY_NAME_VISIBLE]:S.NARROW, [S.MODEL]:model});
		var headingNarrow = panelHeadingNarrow[S.GET_ELEMENT]();
		headingNarrow.appendChild(buttonClose[S.GET_ELEMENT]());
		element.appendChild(headingNarrow);
		element.appendChild(buttonExpandedHeading[S.GET_ELEMENT]());
		element.appendChild(buttonUnexpanded[S.GET_ELEMENT]());
		parentElement.appendChild(element);
		var propertyBindingExpanded = PropertyBinding[S.STANDARD](this, model, S.EXPANDED, expandedChanged);
		var propertyBindingVisible = PropertyBinding[S.STANDARD](this, model, S.VISIBLE, visibleChanged);
		var propertyBindingDisplayMode = PropertyBinding[S.STANDARD](this, model, S.DISPLAY_MODE, displayModeChanged);
		this[S.GET_ELEMENT]=function(){return element;};
		onResize();
		setTimeout(onResize, 0);
		function setExpanded(value){
			propertyBindingExpanded[S.SET](value);
		}
		function getExpanded(){
			return propertyBindingExpanded[S.GET]();
		}
		function expandedChanged(value){
			if(value)element.classList.add('expanded');
			else element.classList.remove('expanded');
		}
		function visibleChanged(value){
			console.log(value);
			if(value)element.classList.add('visible');
			else element.classList.remove('visible');
		}
		function displayModeChanged(value){
			switch(value){
				case PmsDisplayModes.WIDE:
					element.classList.add('wide');
					element.classList.remove('narrow');
				break;
				case PmsDisplayModes.NARROW:
				default:			
					element.classList.remove('wide');
					element.classList.add('narrow');
					break;
			}
		}
		function setDisplayMode(value){
			propertyBindingDisplayMode[S.SET](value);
		}
		function onResize(){
			var viewportDimensions = getViewportDimensions();
			var width = viewportDimensions[0];
			setDisplayMode(width>500?PmsDisplayModes.WIDE:PmsDisplayModes.NARROW);
		}
	};
})();