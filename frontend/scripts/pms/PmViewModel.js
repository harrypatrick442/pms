var PmViewModel = function(){
	var bindingsHandler = BindingsHandlerBuilder(this);
	var self = this;
	var changed = bindingsHandler[S.CHANGED];
	this[S.MINIMISE]=function(){
		
	};
	this[S.CLOSE]=function(){
		
	};
	this[S.DISPOSE]=function(){
		self[S.MY_BINDINGS][S.DISPOSE]();
	};
};