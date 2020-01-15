var PmView = (function(){
	return function(params){
		var self = this;
		var model = params[S.MODEL];
		var buttonClose = new Button({
			[S.CLASS_NAME]:'close',
			[S.METHOD_NAME_CLICK]: S.HIDE
		});
		var element = E.DIV();
		element.classList.add('pm');
		var inner = E.DIV();
		inner.classList.add('pm-inner');
		var feed = E.DIV();
		feed.classList.add('feed');
		var orderedItemsFeed = new OrderedItems({
			[S.ELEMENT]:feed,
			[S.MODEL]:model,
			[S.PROPERTY_NAME_ITEMS]:S.MESSAGES,
			[S.CREATE_VIEW]:function(model){
				return new PmMessageView({[S.MODEL]:model});
			}
		});
		var menu = E.DIV();
		menu.classList.add('menu');
		var typeBox = E.DIV();
		typeBox.classList.add('type-box');
		var textBox = new TextBox({
			[S.CLASS_NAME]:'text-box',
			[S.MODEL]:model,
			[S.PROPERTY_NAME]:S.TYPE_BOX_TEXT,
			[S.METHOD_NAME_ON_ENTER]:S.ON_ENTER,
			[S.PROPERTY_NAME_DISABLED]:S.TYPE_BOX_DISABLED
		});
		var buttonEmoticons = new Button({
			[S.MODEL]:model,
			[S.METHOD_NAME_CLICK]:S.CLICKED_EMOTICON,
			[S.IMAGE_SEMANTIC]:S.PMS_EMOTICON_ICON,
			[S.IMAGE_SEMANTIC_HOVER]:S.PMS_EMOTICON_ICON_HOVER,
			[S.CLASS_NAME]:'emoticons'
		});
		var controlsCollection = new ControlsCollection(buttonEmoticons, textBox, orderedItemsFeed, buttonClose);
		element.appendChild(inner);
		inner.appendChild(feed);
		inner.appendChild(typeBox);
		typeBox.appendChild(textBox[S.GET_ELEMENT]());
		inner.appendChild(menu);
		menu.appendChild(buttonEmoticons[S.GET_ELEMENT]());
		
		this[S.GET_ELEMENT]=function(){return element;};
		this[S.DISPOSE]=function(){
			controlsCollection[S.DISPOSE]();
		};
	};
})();