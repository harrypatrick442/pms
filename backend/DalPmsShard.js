const STORED_PROCEDURE_ADD= 'pms_shard_pms_add';
const STORED_PROCEDURE_PMS_SHARD_UPDATE='pms_shard_update';
const Dal = require('dal');	
const sql = Dal.sql;
const Core = require('core');
const S = require('strings').S;
const PMS = 'pms';
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
	this.get = function(title, userId){
		return new Promise(function(resolve, reject){
			dal.query({storedProcedure:STORED_PROCEDURE_ADD,
				parameters:[
					//{name:USER_ID, value:userId, type:sql.Int}
				]
			}).then(function(result){
				resolve(result.recordset);
			}).catch(reject);
		});
	};
};