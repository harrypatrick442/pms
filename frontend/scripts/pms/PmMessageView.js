var PmMessageView = function(params){
	var self = this;
	var model = params[S.MODEL];
	var element = E.DIV();
	element.classList.add('pm-message');
	var inner = E.DIV();
	inner.classList.add('pm-message-inner');
	element.appendChild(inner);
	
	this[S.GET_ELEMENT]=function(){return element;};
	this[S.DISPOSE]=function(){
		self[S.MY_BINDINGS][S.DISPOSE]();
	};
};