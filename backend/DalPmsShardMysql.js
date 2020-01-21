const STORED_PROCEDURE_SET= 'pms_shard_pms_set', STORED_PROCEDURE_GET= 'pms_shard_pms_get';
const STORED_PROCEDURE_PMS_SHARD_UPDATE='pms_shard_update', STORED_PROCEDURE_USER_STATE_SET='pms_shard_user_state_set';
const {Mysql} = require('dal');

const Core = require('core');
const S = require('strings').S;
const PMS = 'pms', USER_ID_1='userId1', USER_ID_2='userId2', N='n', FROM_INCLUSIVE='fromInclusive', TO_EXCLUSIVE='toExclusive',
	OTHER_USER_ID='otherUserId',EXPANDED='expanded', USER_ID='userId', OPENS='opens';
module.exports = function(configuration){
	const dalMysql = new Mysql(configuration);
	this.update = function(){
		return new Promise((resolve, reect)=>{
			resolve();
		});
	};
	this.set = function(messages){
		
	};
	this.add = function(pms){
		throw new Error('Not implemented');
	};
	this.setUserState = function(userId, userState){
		dalMysql.call({storedProcedure:STORED_PROCEDURE_USER_STATE_SET,
			parameters:[userId,getUserStateOpens(userState)]
		});
	};
	this.get = function(userId1, userId2){
		return new Promise(function(resolve, reject){
			var parameters = [userId1, userId2];
			dalMysql.call({storedProcedure:STORED_PROCEDURE_GET,
				parameters:parameters
			}).then(function(result){
				console.log(result);
				resolve(JSON.parse(result.recordset[0].pm));
			}).catch(reject);
		});
	};
};