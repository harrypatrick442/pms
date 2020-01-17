var PmMessageView = function(model){
	var self = this;
	var element = E.DIV();
	element.classList.add('pm-message');
	var inner = E.DIV();
	inner.classList.add('pm-message-inner');
	element.appendChild(inner);
	if(model[S.GET_IS_ME]())
		element.classList.add('me');
	inner.innerHTML = model[S.GET_CONTENT]();
	this[S.GET_ELEMENT]=function(){return element;};
	this[S.DISPOSE]=function(){
		self[S.MY_BINDINGS][S.DISPOSE]();
	};
};