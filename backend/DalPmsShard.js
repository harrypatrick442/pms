module.exports = new(function(coniguration){
	const STORED_PROCEDURE_ADD= 'pms_shard_pms_add';
    const Dal = require('dal');	
	const sql = Dal.sql;
	const Core = require('core');
	const S = require('strings').S;
	const dal = new Dal(configuration);
	this.add = function(){
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
})();