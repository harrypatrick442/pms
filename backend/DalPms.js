module.exports = new(function(){
	const STORED_PROCEDURE_GET_SHARDS= 'pms_shards_get';,
	STORED_PROCEDURE_GET_SETTINGS='pms_settings_get',
	STORED_PROCEDURE_ADD_SHARD='pms_shard_add';
    const Dal = require('dal');	
	const sql = Dal.sql;
	const Core = require('core');
	const S = require('strings').S;
	const Settings = require('./Settings');
	var dal;
	this.initialize = function(configuration){
		dal = new Dal(configuration);
	};
	this.addShard = function(){
		return new Promise((resolve, reject)=>{
			dal.query({
				storedProcedure:STORED_PROCEDURE_ADD_SHARD,
				parameters:[
					{name:HOST_ID,value:shard.getHostId(), type:sql.Int},
					{name:MULTIMEDIA,value:multimedia, type:sql.Bit},
					{name:ACTIVE,value:active, type:sql.Bit}
				]
			}).then(function(result){
				resolve(result.recordset.select((row)=>{
					return new Shard(row);
				}).toList());
			}).catch(reject);
		});
	};
	this.getSettings = function(){
		return new Promise((resolve, reject)=>{
			dal.query({storedProcedure:STORED_PROCEDURE_GET_SETTINGS
			}).then(function(result){
				var row result.recordset[0];
				if(!row)throw new Error('No rows');
				return Settings.fromSqlRow(row);
			}).catch(reject);
		});
	};
	this.getShards = function(title, userId){
		return new Promise(function(resolve, reject){
			dal.query({storedProcedure:STORED_PROCEDURE_GET_SHARDS
			}).then(function(result){
				var iteratorRows = new Iterator(result.recordset);
				var shards=[];
				readNextRow();
				function readNextRow(){
					if(!iteratorRows.hasNext()){
						resolve(shards);
						return;
					}
					var row = iteratorRows.next();
					Shard.fromSqlRow(row).then((shard)=>{
						shards.push(shard);	
						readNextRow();
					}).catch(reject);
				}
			}).catch(reject);
		});
	};
})();