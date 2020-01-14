module.exports = new (function(params){
	const path = require('path');
	const PmsLog = require('./PmsLog');
	const Dal = require('dal');
	const {DalDatabases, ShardBuilder, Table, TableColumn, TableColumnTypes} = Dal;
	console.log(TableColumnTypes);
	const Core = require('core');
	const Iterator = Core.Iterator;
	const Shard= require('./Shard');
	const PMS_SHARD=path.join(__dirname, '../database/pms_shard/programmability/'),
	PMS_SHARD_STORED_PROCEDURES=PMS_SHARD+'stored_procedures/',
	PMS_SHARD_SCALAR_FUNCTIONS=PMS_SHARD+'scalar_functions/',
	PMS_SHARD_TABLE_VALUED_FUNCTIONS=PMS_SHARD+'table_valued_functions/', 
	PMS_SHARD_TBLPMS_TABLENAMES_GET_BY_DATE_RANGE_DESCENDING=PMS_SHARD_TABLE_VALUED_FUNCTIONS+'pms_shard_tblPms_tableNames_get_by_date_range_descending.sql',
	PMS_SHARD_HORIZONTAL_PARTITIONS_CREATE=PMS_SHARD_STORED_PROCEDURES+'pms_shard_horizontal_partitions_create.sql',
	PMS_SHARD_PMS_ADD_UPATE=PMS_SHARD_STORED_PROCEDURES+'pms_shard_pms_add_update.sql',
	PMS_SHARD_PMS_GET_UPDATE=PMS_SHARD_STORED_PROCEDURES+'pms_shard_pms_get_update.sql',
	PMS_SHARD_UPDATE =PMS_SHARD_STORED_PROCEDURES+'pms_shard_update.sql';
	const programmablePaths = [
		PMS_SHARD_TBLPMS_TABLENAMES_GET_BY_DATE_RANGE_DESCENDING, PMS_SHARD_HORIZONTAL_PARTITIONS_CREATE, 
		PMS_SHARD_PMS_ADD_UPATE, PMS_SHARD_PMS_GET_UPDATE, PMS_SHARD_UPDATE
	];
	const tblHorizontalPartitions= new Table({
		name:'tblHorizontalPartitions',
		columns:[
			new TableColumn({name:'id', type:TableColumnTypes.INT, primaryKey:true, nullable:false, autoIncrement:true}),
			new TableColumn({name:'from', type:TableColumnTypes.DATETIME, nullable:false}),
			new TableColumn({name:'tableName', type:TableColumnTypes.VARCHAR, length:50, nullable:false}),
			new TableColumn({name:'parentId', type:TableColumnTypes.INT, nullable:true}),
			new TableColumn({name:'createdAt', type:TableColumnTypes.DATETIME, nullable:false})
		]
	});
	const tables =[tblHorizontalPartitions];
	this.build = function(params){
		const userIdFromInclusive = params.userIdFromInclusive;
		if(!userIdFromInclusive)throw new Error('No userIdFromInclusive provided');
		const userIdToExclusive = params.userIdToExclusive;
		if(!userIdToExclusive)throw new Error('No userIdToExclusive provided');
		return ShardBuilder.build({ 
			shardHost : params.shardHost,
			name : 'pms_'+userIdFromInclusive+'_'+userIdToExclusive,
			programmablePaths:programmablePaths,
			tables:tables,
			createShard:(databaseConfiguration, shardHost)=>{return createShard(databaseConfiguration, shardHost, userIdFromInclusive, userIdToExclusive);}
		});
	};
	function createShard(databaseConfiguration, shardHost, userIdFromInclusive, userIdToExclusive){
		return new Promise((resolve, reject)=>{
			resolve(new Shard({
				userIdFromInclusive:userIdFromInclusive,
				userIdToExclusive:userIdToExclusive,
				databaseConfiguration:databaseConfiguration,
				shardHost:shardHost
			}));
		});
	}
})();