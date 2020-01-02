module.exports = new(function(){
	const STORED_PROCEDURE_GET_SHARDS= 'pms_shards_get';
    const Dal = require('dal');	
	const sql = Dal.sql;
	const Core = require('core');
	const S = require('strings').S;
	var dal;
	this.initialize = function(configuration){
		dal = new Dal(configuration);
	};
	this.add = function(){
		
	};
	this.getShards = function(title, userId){
		return new Promise(function(resolve, reject){
			dal.query({storedProcedure:STORED_PROCEDURE_GET_SHARDS
			}).then(function(result){
				resolve(result.recordset.select((row)=>{
					return new Shard(row);
				}).toList());
			}).catch(reject);
		});
	};
})();