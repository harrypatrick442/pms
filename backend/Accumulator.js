const PmsLog = require('./PmsLog');
module.exports = function(settings, dalPmsShard){
	const settings = params.settings;
	const dalPmsShard = params.dalPmsShard;
	const sendToDevices = params.sendToDevices;
	const CONTENT='content', USER_ID_FROM='userIdFrom', USER_ID_TO='userIdTo', SENT_AT='sentAt';
	var list =[];
	var temporalCallbackFlush = new TemporalCallback({			
		callback :flush,
		maxNTriggers = settings.getAccumulatorMaxNMessages(),
		maxTotalDelay:settings.getAccumulatorMaxTotalDelay(),
		delay: settings.getAccumulatorDelay()
	});
	this.add = function(message){
		validateMessage(message);
		list.push(message);
		temporalCallbackFlush.trigger();
	};
	function validateMessage(){
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
		table.columns.add(CONTENT,sql.Text);
		currentList.forEach((message)=>{
			table.rows.add(message[S.USER_ID_FROM], message[S.USER_ID_TO], new Date().getTime(), message[S.CONTENT]);
		});
		dalPmsShard.add(table).then(()=>{
			sendToDevices(currentList);
		}).catch((err)=>{
			PmsLog.error(err);
		});
	}
};