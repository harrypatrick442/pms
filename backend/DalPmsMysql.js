module.exports = new(function(){
	const STORED_PROCEDURE_SHARDS_GET= 'pms_shards_get',
	STORED_PROCEDURE_SETTINGS_GET='pms_settings_get',
	STORED_PROCEDURE_SHARD_ADD='pms_shard_add',
	STORED_PROCEDURE_SHARD_HOSTS_GET='pms_shard_hosts_get',
	STORED_PROCEDURE_SHARDS_DELETE='pms_shards_delete';
    const {Mysql} = require('dal');
	const Core = require('core');
	const S = require('strings').S;
	const Iterator = Core.Iterator;
	var dalMysql;
	const HOST_ID='hostId', NAME='name', USER_ID_FROM_INCLUSIVE='userIdFromInclusive', USER_ID_TO_EXCLUSIVE='userIdToExclusive', IDS='ids';
	this.initialize = function(configuration){
		dalMysql = new Mysql(configuration);
	};
	this.getSettings = function(){
		return new Promise((resolve, reject)=>{
			dalMysql.call({storedProcedure:STORED_PROCEDURE_SETTINGS_GET
			}).then(function(result){
				var row = result.recordset[0];
				if(!row)throw new Error('No rows');
				const Settings = getSettingsClass();
				resolve(Settings.fromSqlRow(row));
			}).catch(reject);
		});
	};
	this.getShards = function(sendToDevices, shardHostHelper, settings){
		return new Promise(function(resolve, reject){
			dalMysql.call({storedProcedure:STORED_PROCEDURE_SHARDS_GET
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
					Shard.fromSqlRow(row, sendToDevices, shardHostHelper, settings).then((shard)=>{
						shards.push(shard);	
						readNextRow();
					}).catch(reject);
				}
			}).catch(reject);
		});
	};
	this.deleteShards = function(shardIds){
		return dalMysql.call({
				storedProcedure:STORED_PROCEDURE_SHARDS_DELETE,
				parameters:[shardIds]
			});
	};
	this.getShardHosts = function(){
		return new Promise(function(resolve, reject){
			dalMysql.call({storedProcedure:STORED_PROCEDURE_SHARD_HOSTS_GET
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
					console.log(row);
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