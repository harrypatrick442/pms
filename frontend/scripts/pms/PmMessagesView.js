var PmMessagesView = function(model){
	var self = this;
	var element = E.DIV();
	element.classList.add('pm-messages');
	console.log(model);
	var mapClientAssignedUuidToPmMessageView={};
	model[S.SET_APPEND_MESSAGE_CALLBACK](appendMessage);
	model[S.SET_INSERT_MESSAGE_CALLBACK](insertMessage);
	this[S.GET_ELEMENT]=function(){return element;};
	this[S.DISPOSE]=function(){
		
	};
	function appendMessage(pmMessageViewModel){
		var pmMessageView= new PmMessageView(pmMessageViewModel);
		element.appendChild(pmMessageView[S.GET_ELEMENT]());
		mapClientAssignedUuidToPmMessageView[pmMessageViewModel[S.GET_CLIENT_ASSIGNED_UUID]()]=pmMessageView;
	}
	function insertMessage(pmMessageViewModel, pmMessageViewModelBefore){
		var pmMessageView= new PmMessageView(pmMessageViewModel);
		var pmMessageViewBefore = smapClientAssignedUuidToPmMessageView[pmMessageViewModelBefore[S.GET_CLIENT_ASSIGNED_UUI]()];
		element.insertBefore(pmMessageView[S.GET_ELEMENT](), pmMessageViewBefore[S.GET_ELEMENT]());
		mapClientAssignedUuidToPmMessageView[pmMessageViewModel[S.GET_CLIENT_ASSIGNED_UUI]()]=pmMessageView;
	}
};