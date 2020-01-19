const STORED_PROCEDURE_ADD= 'pms_shard_pms_add', STORED_PROCEDURE_GET= 'pms_shard_pms_get';
const STORED_PROCEDURE_PMS_SHARD_UPDATE='pms_shard_update', STORED_PROCEDURE_USER_STATE_SET='pms_shard_user_state_set';
const Dal = require('dal');	
const sql = Dal.sql;
const Core = require('core');
const S = require('strings').S;
const PMS = 'pms', USER_ID_1='userId1', USER_ID_2='userId2', N='n', FROM_INCLUSIVE='fromInclusive', TO_EXCLUSIVE='toExclusive',
	OTHER_USER_ID='otherUserId',EXPANDED='expanded', USER_ID='userId', OPENS='opens';
module.exports = function(configuration){
	const dal = new Dal(configuration);
	this.update = function(){
		return dal.query({storedProcedure:STORED_PROCEDURE_PMS_SHARD_UPDATE});
	};
	this.add = function(pms){
		return new Promise(function(resolve, reject){
			dal.query({storedProcedure:STORED_PROCEDURE_ADD,
				parameters:[
					{name:PMS, value:pms}				
				]
			}).then(resolve).catch(reject);
		});
	};
	this.setUserState = function(userId, userState){
		
		dal.query({storedProcedure:STORED_PROCEDURE_USER_STATE_SET,
			parameters:[
				{name:USER_ID, value:userId, type:sql.Int},
				{name:OPENS, value:getUserStateOpens(userState)}
			]
		});
	};
	this.get = function(userId1, userId2, n, fromInclusive, toExclusive){
		return new Promise(function(resolve, reject){
			var parameters = [
					{name:USER_ID_1, value:userId1, type:sql.Int},
					{name:USER_ID_2, value:userId2, type:sql.Int}
				];
			if(n)parameters.push({name:N, value:n, type:sql.Int});
			if(fromInclusive)parameters.push({name:FROM_INCLUSIVE, value:fromInclusive, type:sql.DateTime});
			if(toExclusive)parameters.push({name:TO_EXCLUSIVE, value:toExclusive, type:sql.DateTime});
			dal.query({storedProcedure:STORED_PROCEDURE_GET,
				parameters:parameters
			}).then(function(result){
				console.log(result);
				resolve(JSON.parse(result.recordset[0].pm));
			}).catch(reject);
		});
	};
	function getUserStateOpens(userState){
		const OTHER_USER_ID='otherUserId',EXPANDED='expanded';
		var table = new sql.Table();
		table.columns.add(OTHER_USER_ID,sql.Int);
		table.columns.add(EXPANDED,sql.Bit);
		userState[S.OPENS].forEach((open)=>{
			table.rows.add(open[S.USER_ID], open[S.EXPANDED]);
		});
	}
};