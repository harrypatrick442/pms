const MESSAGE='message';
const EventEnabledBuilder = require('core').EventEnabledBuilder;
const ItemTypes = require('enums').ItemTypes;
const InterserverCommunication = require('interserver_communication');
const ItemRouter = InterserverCommunication.ItemRouter;
module.exports = new (function(){
	EventEnabledBuilder(this);
	var self = this;
	var pmsUserStateCache;
	const itemType = ItemTypes.PMS_USER_STATE;
	var itemRouter = new ItemRouter({itemType:itemType, getIds:getIds});
	this.getChannels=itemRouter.getChannels;
	this.getRoutingTable=itemRouter.getRoutingTable;
	this.getMyIp = itemRouter.getMyIp;
	this.sendToServersWith=itemRouter.sendToServersWithItem;
	this.getSendToServerWithTryHandle = itemRouter.getSendToServerWithItemTryHandle
	this.has = itemRouter.hasItem;
	this.add=itemRouter.addItem;
	this.remove = itemRouter.removeItem;
	this.getItemType = itemRouter.getItemType;
	this.setmapItemIdToForwards = function(value){
		pmsUserStateCache=value;
	};
	itemRouter.incoming = incoming;
	function getIds(){
		return pmsUserStateCache.getLocalIds();
	}
	function incoming(msg, channel, itemId){
		validateHasProfileAndSendRoutingTableIfNecessary(itemId);
		dispatchOnMessage(msg, channel);
	}
	function validateHasProfileAndSendRoutingTableIfNecessary(itemId, channel){
		if(!itemId)return;
		if(pmsUserStateCache.hasLocal(itemId))return;
		itemRouter.sendRoutingTable(channel.getIp());
	}
	function dispatchOnMessage(msg, channel){
		self.dispatchEvent({type:MESSAGE, msg:msg, channel:channel.getPublic()});
	}
})();