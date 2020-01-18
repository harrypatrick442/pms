var PmMessagesViewModel = function(params){
	EventEnabledBuilder(this);
	var model = params[S.MODEL];
	var mapClientAssignedUuidToMessage ={};
	var propertyBindingMessages = PropertyBinding[S.STANDARD]( this, model, S.MESSAGES,()=>{});
	var list =[], appendMessageCallback, insertMessageCallback;
	each(propertyBindingMessages[S.GET](), function(pmMessage){ 
		console.log(pmMessage);
		var clientAssignedUuid = pmMessage[S.GET_CLIENT_ASSIGNED_UUID]();
		if(mapClientAssignedUuidToMessage[clientAssignedUuid])return;
		var pmMessageViewModel = new PmMessageViewModel(pmMessage);
		mapClientAssignedUuidToMessage[clientAssignedUuid]=pmMessageViewModel;
	});
	this[S.ADD_RANGE_RAW]=function(messages){
		each(messages, function(message){
			var clientAssignedUuid = message[S.CLIENT_ASSIGNED_UUID];
			if(mapClientAssignedUuidToMessage[clientAssignedUuid])return;
			addMessage(new PmMessage(message));
		});
	};
	this[S.SET_APPEND_MESSAGE_CALLBACK]=function(appendMessageCallbackIn){
		appendMessageCallback=appendMessageCallbackIn;
	};
	this[S.SET_INSERT_MESSAGE_CALLBACK]=function(insertMessageCallbackIn){
		insertMessageCallback = insertMessageCallbackIn;
	};
	function addMessage(newPmMessageViewModel){
		var clientAssignedUuid= newPmMessage[S.GET_CLIENT_ASSIGNED_UUID]();
		var sentAt= newPmMessage[S.GET_SENT_AT]();
		mapClientAssignedUuidToMessage[clientAssignedUuid]=newPmMessageViewModel;
		var lastIndex=list.length-1;
		if(list.length<1||sentAt>list[lastIndex][S.GET_SENT_AT]()){
			appendMessage(newPmMessageViewModel);
			return;
		}
		for(var i=lastIndex-1; i>=0; i--){
			if(sentAt>list[i][S.GET_SENT_AT]()){
				insertMessage(newPmMessageViewModel, i+1);
				return;
			}
		}
		insertMessage(newPmMessageViewModel,0); 
	}
	/*function overflowMessages(n){
		list = 
		overflowMessagesCallback(n);
	}*/
	function appendMessage(pmMessageViewModel){
		appendMessageCallback(pmMessageViewModel);
	}
	function insertMessage(pmMessageViewModel){
		insertMessageCallback(pmMessageViewModel);
	}
};