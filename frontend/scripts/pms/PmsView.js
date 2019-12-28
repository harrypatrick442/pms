var PmsView = (function(){
	return function(params){
		var model = params[S.MODEL];
		var parentElement = params[S.ELEMENT];
		var self = this;
		var buttonClose = new Button({
			[S.CLASS_NAME]:'close',
			[S.METHOD_NAME_CLICK]: S.HIDE,
			[S.MODEL]:model,
			[S.IMAGE_SEMANTIC]:S.PMS_CLOSE_ICON,
			[S.IMAGE_SEMANTIC_HOVER]:S.PMS_CLOSE_ICON_HOVER
		});
		var element = E.DIV();
		element.classList.add('pms');
		var inner = E.DIV();
		inner.classList.add('inner');
		var popup = new Popup({[S.ELEMENT]:inner, [S.PROPERTY_NAME_VISIBLE]:S.VISIBLE, [S.MODEL]:model});
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
		var spanExpandedHeadingChat = E.SPAN();
		spanExpandedHeadingChat.innerHTML='Chat';
		var textBlockExpandedHeadingOnline = new TextBlock({
			[S.PROPERTY_NAME]:S.ONLINE_TEXT,
			[S.MODEL]:model
		});
		var buttonExpandedHeadingElement = buttonExpandedHeading[S.GET_ELEMENT]();
		buttonExpandedHeadingElement.appendChild(spanExpandedHeadingChat);
		buttonExpandedHeadingElement.appendChild(textBlockExpandedHeadingOnline[S.GET_ELEMENT]());
		
		var panelSearch = new Panel({[S.CLASS_NAME]:'search', [S.MODEL]:model, [S.PROPERTY_NAME_VISIBLE]:S.EXPANDED});
		var panelSearchElement = panelSearch[S.GET_ELEMENT]();
		var imageControlSearch = new ImageControl({[S.SEMANTIC]:S.PMS_SEARCH_ICON});
		var textWrapperSearch = E.DIV();
		textWrapperSearch.classList.add('text');
		var textBoxSearch = new TextBox({[S.MODEL]:model, [S.PLACEHOLDER]:'Search', [S.PROPERTY_NAME]:S.SEARCH_TEXT});
		panelSearchElement.appendChild(imageControlSearch[S.GET_ELEMENT]());
		textWrapperSearch.appendChild(textBoxSearch[S.GET_ELEMENT]());
		panelSearchElement.appendChild(textWrapperSearch);
		var panelHeadingNarrow = new Panel({[S.CLASS_NAME]:'heading-narrow', [S.PROPERTY_NAME_VISIBLE]:S.NARROW, [S.MODEL]:model});
		var headingNarrow = panelHeadingNarrow[S.GET_ELEMENT]();
		var headingNarrowChat = E.DIV();
		headingNarrowChat.innerHTML='Chat';
		headingNarrowChat.classList.add('chat');
		var textBlockNarrow = new TextBlock({
			[S.CLASS_NAME]:'online',
			[S.MODEL]:model,
			[S.PROPERTY_NAME]:S.ONLINE_TEXT_BRACKETED
		});
		headingNarrow.appendChild(headingNarrowChat);
		headingNarrowChat.appendChild(textBlockNarrow[S.GET_ELEMENT]());
		headingNarrow.appendChild(buttonClose[S.GET_ELEMENT]());
		var panelEntries = new Panel({ [S.PROPERTY_NAME_VISIBLE]:S.ENTRIES_VISIBLE, [S.MODEL]:model});
		var entriesElement = panelEntries[S.GET_ELEMENT]();
		entriesElement.classList.add('entries');
		var orderedItemsEntries = new OrderedItems({
			[S.PROPERTY_NAME_ITEMS]:S.ENTRIES,
			[S.MODEL]:model,
			[S.ELEMENT]:entriesElement,
			[S.CREATE_VIEW]:function(viewModel){
				return new PmsEntryView({[S.MODEL]:viewModel});
			}
		});
		var panelOpens = new Panel({ [S.PROPERTY_NAME_VISIBLE]:S.WIDE, [S.MODEL]:model});
		var opensElement = panelOpens[S.GET_ELEMENT](); opensElement.classList.add('pms-opens');
		var orderedItemsOpens = new OrderedItems({
			[S.PROPERTY_NAME_ITEMS]:S.OPEN,
			[S.MODEL]:model,
			[S.ELEMENT]:opensElement,
			[S.CREATE_VIEW]:function(viewModel){
				return new PmWindowView({[S.MODEL]:viewModel});
			}
		});
		
		
		var panelOpen = new Panel({ [S.PROPERTY_NAME_VISIBLE]:S.OPEN_VISIBLE, [S.MODEL]:model});
		var openElement = panelOpen[S.GET_ELEMENT]();
		  
		document.documentElement.appendChild(opensElement);
		inner.appendChild(headingNarrow);
		inner.appendChild(buttonExpandedHeadingElement);
		inner.appendChild(entriesElement);
		inner.appendChild(openElement);
		inner.appendChild(panelSearchElement);
		inner.appendChild(buttonUnexpanded[S.GET_ELEMENT]());
		element.appendChild(inner);
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
		function getOpensWidth(){
			return opensElement.offsetWidth;
		}
	};
})();