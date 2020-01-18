var PmMessagesViewModel = function(params){
	EventEnabledBuilder(this);
	var model = params[S.MODEL];
	var userId = params[S.USER_ID];
	var mapClientAssignedUuidToMessage ={};
	var propertyBindingMessages = PropertyBinding[S.STANDARD]( this, model, S.MESSAGES,()=>{});
	var list =[], appendMessageCallback, insertMessageCallback;
	each(propertyBindingMessages[S.GET](), function(pmMessage){ 
		console.log(pmMessage);
		var clientAssignedUuid = pmMessage[S.GET_CLIENT_ASSIGNED_UUID]();
		if(mapClientAssignedUuidToMessage[clientAssignedUuid])return;
		var pmMessageViewModel = new PmMessageViewModel({[S.MODEL]:pmMessage, [S.USER_ID]:userId});
		mapClientAssignedUuidToMessage[clientAssignedUuid]=pmMessageViewModel;
		appendMessage(pmMessageViewModel);
	});
	this[S.ADD_RANGE_RAW]=function(messages){
		each(messages, function(message){
			var clientAssignedUuid = message[S.CLIENT_ASSIGNED_UUID];
			if(mapClientAssignedUuidToMessage[clientAssignedUuid])return;
			addMessage(new PmMessageViewModel({[S.MODEL]:new PmMessage(message), [S.USER_ID]:userId}));
		});
	};
	this[S.SET_APPEND_MESSAGE_CALLBACK]=function(appendMessageCallbackIn){
		appendMessageCallback=appendMessageCallbackIn;
	};
	this[S.SET_INSERT_MESSAGE_CALLBACK]=function(insertMessageCallbackIn){
		insertMessageCallback = insertMessageCallbackIn;
	};
	function addMessage(newPmMessageViewModel){
		var clientAssignedUuid= newPmMessageViewModel[S.GET_CLIENT_ASSIGNED_UUID]();
		var sentAt= newPmMessageViewModel[S.GET_SENT_AT]();
		mapClientAssignedUuidToMessage[clientAssignedUuid]=newPmMessageViewModel;
		var lastIndex=list.length-1;
		if(list.length<1||sentAt>list[lastIndex][S.GET_SENT_AT]()){
			appendMessage(newPmMessageViewModel);
			return;
		}
		for(var i=lastIndex-1; i>=0; i--){
			if(sentAt>list[i][S.GET_SENT_AT]()){
				insertMessage(newPmMessageViewModel, list[i+1]);
				return;
			}
		}
		insertMessage(newPmMessageViewModel,0); 
	}
	function appendMessage(pmMessageViewModel){
		console.log('append');
		appendMessageCallback(pmMessageViewModel);
	}
	function insertMessage(pmMessageViewModel, pmMessageViewModelBefore){
		insertMessageCallback(pmMessageViewModel, pmMessageViewModelBefore);
	}
};