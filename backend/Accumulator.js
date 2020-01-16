const PmsLog = require('./PmsLog');
const Core = require('core');
const S = require('strings').S;
const sql = require('dal').sql;
const TemporalCallback = Core.TemporalCallback;
module.exports = function(params){
	const settings = params.settings;
	const dalPmsShard = params.dalPmsShard;
	const sendToDevices = params.sendToDevices;
	const CONTENT='content', USER_ID_FROM='userIdFrom', USER_ID_TO='userIdTo', SENT_AT='sentAt';
	var list =[];
	const maxNMessages = settings.getAccumulatorMaxNMessages();
	if(!maxNMessages) throw new Error('maxNMessages not set in settings');
	const maxTotalWait = settings.getAccumulatorMaxTotalWait();
	if(!maxTotalWait) throw new Error('maxTotalWait not set in settings');
	const maxWaitBetweenMessages =settings.getAccumulatorMaxWaitBetweenMessages();
	if(!maxWaitBetweenMessages)throw new Error('maxWaitBetweenMessages not set in settings');
	var temporalCallbackFlush = new TemporalCallback({			
		callback :flush,
		maxNTriggers:maxNMessages,
		maxTotalDelay:maxTotalWait,
		delay: maxWaitBetweenMessages
	});
	this.add = function(message){
		console.log('adding message to accumulator');
		validateMessage(message);
		list.push(message);
		temporalCallbackFlush.trigger();
	};
	function validateMessage(message){
		var content = message[S.CONTENT];
		if((!content)||typeof(content)!=='string'||isNaN(parseInt(message[S.USER_ID_FROM]))||isNaN(parseInt(message[S.USER_ID_TO])))
			throw new Error('Not a valid message');
	}
	function flush(){
		var currentList = list;
		list=[];
		var table = new sql.Table();
		table.columns.add(USER_ID_FROM,sql.Int);
		table.columns.add(USER_ID_TO,sql.Int);
		table.columns.add(SENT_AT,sql.DateTime);
		table.columns.add(CONTENT,sql.VarChar(640));
		currentList.forEach((message)=>{
			table.rows.add(message[S.USER_ID_FROM], message[S.USER_ID_TO], message[S.SENT_AT], message[S.CONTENT]);
		});
		dalPmsShard.add(table).then(()=>{
			sendToDevices(currentList);
		}).catch((err)=>{
			PmsLog.error(err);
		});
	}
};