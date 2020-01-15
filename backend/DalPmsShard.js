const STORED_PROCEDURE_ADD= 'pms_shard_pms_add';
const STORED_PROCEDURE_HORIZONTAL_PARTITIONS_CREATE='pms_shard_horizontal_partitions_create';
const Dal = require('dal');	
const sql = Dal.sql;
const Core = require('core');
const S = require('strings').S;
module.exports = function(configuration){
	const dal = new Dal(configuration);
	this.createHorizontalPartitions = function(){
		return dal.query({storedProcedure:STORED_PROCEDURE_HORIZONTAL_PARTITIONS_CREATE});
	};
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
};