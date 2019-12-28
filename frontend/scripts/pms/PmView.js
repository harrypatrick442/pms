var PmView = (function(){
	return function(viewModel){
		var self = this;
		var buttonClose = new Button({
			[S.CLASS_NAME]:'close',
			[S.METHOD_NAME_CLICK]: S.HIDE
		});
		var element = E.DIV();
		element.classList.add('pm');
		var inner = E.DIV();
		inner.classList.add('inner');
		var heading = E.DIV();
		heading.classList.add('heading');
		element.appendChild(inner);
		var propertyBindingExpanded = PropertyBinding[S.STANDARD](this, viewModel, S.EXPANDED, expandedChanged);
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