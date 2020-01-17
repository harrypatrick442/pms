const STORED_PROCEDURE_ADD= 'pms_shard_pms_add', STORED_PROCEDURE_GET= 'pms_shard_pms_get';
const STORED_PROCEDURE_PMS_SHARD_UPDATE='pms_shard_update';
const Dal = require('dal');	
const sql = Dal.sql;
const Core = require('core');
const S = require('strings').S;
const PMS = 'pms', USER_ID_1='userId1', USER_ID_2='userId2', N='n', FROM_INCLUSIVE='fromInclusive', TO_EXCLUSIVE='toExclusive';
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
				console.log(result.recordset);
				resolve(result.recordset);
			}).catch(reject);
		});
	};
};