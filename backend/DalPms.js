module.exports = new(function(){
	const STORED_PROCEDURE_SHARDS_GET= 'pms_shards_get',
	STORED_PROCEDURE_SETTINGS_GET='pms_settings_get',
	STORED_PROCEDURE_SHARD_ADD='pms_shard_add',
	STORED_PROCEDURE_SHARD_HOSTS_GET='pms_shard_hosts_get';
    const Dal = require('dal');	
	const sql = Dal.sql;
	const Core = require('core');
	const S = require('strings').S;
	const Iterator = Core.Iterator;
	var dal;
	this.initialize = function(configuration){
		dal = new Dal(configuration);
	};
	this.addShard = function(){
		return new Promise((resolve, reject)=>{
			dal.query({
				storedProcedure:STORED_PROCEDURE_SHARD_ADD,
				parameters:[
					{name:HOST_ID,value:shard.getHostId(), type:sql.Int},
					{name:MULTIMEDIA,value:multimedia, type:sql.Bit},
					{name:ACTIVE,value:active, type:sql.Bit}
				]
			}).then(function(result){
				const Shard = getShardClass();
				resolve(result.recordset.select((row)=>{
					return new Shard(row);
				}).toList());
			}).catch(reject);
		});
	};
	this.getSettings = function(){
		return new Promise((resolve, reject)=>{
			dal.query({storedProcedure:STORED_PROCEDURE_SETTINGS_GET
			}).then(function(result){
				var row = result.recordset[0];
				if(!row)throw new Error('No rows');
				const Settings = getSettingsClass();
				resolve(Settings.fromSqlRow(row));
			}).catch(reject);
		});
	};
	this.getShards = function(){
		return new Promise(function(resolve, reject){
			dal.query({storedProcedure:STORED_PROCEDURE_SHARDS_GET
			}).then(function(result){
				var iteratorRows = new Iterator(result.recordset);
				var shards=[];
				const Shard = getShardClass();
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
	this.getShardHosts = function(){
		return new Promise(function(resolve, reject){
			dal.query({storedProcedure:STORED_PROCEDURE_SHARD_HOSTS_GET
			}).then(function(result){
				var iteratorRows = new Iterator(result.recordset);
				var shardHosts=[];
				const ShardHost = getShardHostClass();
				readNextRow();
				function readNextRow(){
					if(!iteratorRows.hasNext()){
						resolve(shardHosts);
						return;
					}
					var row = iteratorRows.next();
					ShardHost.fromSqlRow(row).then((shardHost)=>{
						shardHosts.push(shardHost);	
						readNextRow();
					}).catch(reject);
				}
			}).catch(reject);
		});
	};
	function getShardClass(){
		return require('./Shard');
	}
	function getShardHostClass(){
		return require('./ShardHost');
	}
	function getSettingsClass(){
		return require('./Settings');
	}
})();