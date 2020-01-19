module.exports = new (function(params){
	const path = require('path');
	const PmsLog = require('./PmsLog');
	const Dal = require('dal');
	const {DalDatabases, ShardBuilder, Table, TableColumn, TableColumnTypes} = Dal;
	console.log(TableColumnTypes);
	const Core = require('core');
	const Iterator = Core.Iterator;
	const Shard= require('./Shard');
	const Settings = require('./Settings');
	const PMS_SHARD=path.join(__dirname, '../database/pms_shard/programmability/'),
	PMS_SHARD_STORED_PROCEDURES=PMS_SHARD+'stored_procedures/',
	PMS_SHARD_SCALAR_FUNCTIONS=PMS_SHARD+'scalar_functions/',
	PMS_SHARD_TABLE_VALUED_FUNCTIONS=PMS_SHARD+'table_valued_functions/', 
	PMS_SHARD_TBLPMS_TABLENAMES_GET_BY_DATE_RANGE_DESCENDING=PMS_SHARD_TABLE_VALUED_FUNCTIONS+'pms_shard_tblPms_tableNames_get_by_date_range_descending.sql',
	PMS_SHARD_HORIZONTAL_PARTITIONS_CREATE=PMS_SHARD_STORED_PROCEDURES+'pms_shard_horizontal_partitions_create.sql',
	PMS_SHARD_PMS_ADD_UPATE=PMS_SHARD_STORED_PROCEDURES+'pms_shard_pms_add_update.sql',
	PMS_SHARD_PMS_GET_UPDATE=PMS_SHARD_STORED_PROCEDURES+'pms_shard_pms_get_update.sql',
	PMS_SHARD_UPDATE =PMS_SHARD_STORED_PROCEDURES+'pms_shard_update.sql',
	PMS_SHARD_TBLPMS_TABLENAMES_GET_BY_DATE_RANGE=PMS_SHARD_SCALAR_FUNCTIONS+'pms_shard_tblPms_tableNames_get_by_date_range.sql',
	PMS_SHARD_TBLPMS_TABLENAME_LATEST_GET=PMS_SHARD_SCALAR_FUNCTIONS+'pms_shard_tblPms_tableName_latest_get.sql',
	PMS_SHARD_PMS_TBLPMSX_SELECT_GET=PMS_SHARD_SCALAR_FUNCTIONS+'pms_shard_pms_tblPmsX_select_get.sql';
	const programmablePaths = [
		PMS_SHARD_TBLPMS_TABLENAMES_GET_BY_DATE_RANGE_DESCENDING, PMS_SHARD_HORIZONTAL_PARTITIONS_CREATE, 
		PMS_SHARD_PMS_ADD_UPATE, PMS_SHARD_PMS_GET_UPDATE, PMS_SHARD_UPDATE,PMS_SHARD_TBLPMS_TABLENAMES_GET_BY_DATE_RANGE
		,PMS_SHARD_TBLPMS_TABLENAME_LATEST_GET,PMS_SHARD_PMS_TBLPMSX_SELECT_GET
	];
	const tblHorizontalPartitions= new Table({
		name:'tblHorizontalPartitions',
		columns:[
			new TableColumn({name:'id', type:TableColumnTypes.INT, primaryKey:true, nullable:false, autoIncrement:true}),
			new TableColumn({name:'from', type:TableColumnTypes.DATETIME, nullable:false}),
			new TableColumn({name:'tableName', type:TableColumnTypes.VARCHAR, length:50, nullable:false}),
			new TableColumn({name:'parentId', type:TableColumnTypes.INT, nullable:true}),
			new TableColumn({name:'createdAt', type:TableColumnTypes.DATETIME, nullable:false}),
			new TableColumn({name:'to', type:TableColumnTypes.DATETIME, nullable:true})
		]
	});
	const tblUserStatesOpens= new Table({
		name:'tblUserStatesOpens',
		columns:[
			new TableColumn({name:'userId', type:TableColumnTypes.INT, nullable:false}),
			new TableColumn({name:'otherUserId', type:TableColumnTypes.INT, nullable:false}),
			new TableColumn({name:'expanded', type:TableColumnTypes.BIT, nullable:false})
		]
	});
	const tblLastSeens= new Table({
		name:'tblLastSeens',
		columns:[
			new TableColumn({name:'userIdLowest', type:TableColumnTypes.INT, nullable:false}),
			new TableColumn({name:'userIdHighest', type:TableColumnTypes.INT, nullable:false}),
			new TableColumn({name:'lastSeen', type:TableColumnTypes.UNIQUE_IDENTIFIER, nullable:true})
		]
	});
	const tableTypePms = new Table({
		name:'Pms',
		columns:[
			new TableColumn({name:'userIdFrom', type:TableColumnTypes.INT, nullable:false}),
			new TableColumn({name:'userIdTo', type:TableColumnTypes.INT, nullable:false}),
			new TableColumn({name:'sentAt', type:TableColumnTypes.DATETIME, nullable:false}),
			new TableColumn({name:'content', type:TableColumnTypes.VARCHAR, length:640, nullable:false}),
			new TableColumn({name:'clientAssignedUuid', type:TableColumnTypes.UNIQUE_IDENTIFIER, nullable:false})
		]
	});
	const tableTypeUserStateOpen = new Table({
		name:'UserStateOpens',
		columns:[
			new TableColumn({name:'otherUserId', type:TableColumnTypes.INT, nullable:false}),
			new TableColumn({name:'expanded', type:TableColumnTypes.BIT, nullable:false})
		]
	});
	const tableTypes =[tableTypePms, tableTypeUserStateOpen, tblLastSeens];
	const tables =[tblHorizontalPartitions, tblUserStatesOpens];
	this.build = function(params){
		const userIdFromInclusive = params.userIdFromInclusive;
		if(!userIdFromInclusive)throw new Error('No userIdFromInclusive provided');
		const userIdToExclusive = params.userIdToExclusive;
		if(!userIdToExclusive)throw new Error('No userIdToExclusive provided');
		const sendToDevices = params.sendToDevices;
		if(!sendToDevices)throw new Error('No sendToDevices provided');
		return ShardBuilder.build({ 
			shardHost : params.shardHost,
			name : 'pms_'+userIdFromInclusive+'_'+userIdToExclusive,
			programmablePaths:programmablePaths,
			tables:tables,
			tableTypes:tableTypes,
			createShard:(databaseConfiguration, shardHost)=>{return createShard(databaseConfiguration, shardHost, userIdFromInclusive, userIdToExclusive, sendToDevices);}
		});
	};
	function createShard(databaseConfiguration, shardHost, userIdFromInclusive, userIdToExclusive, sendToDevices){
		return new Promise((resolve, reject)=>{
			Settings.get().then((settings)=>{
				resolve(new Shard({
					userIdFromInclusive:userIdFromInclusive,
					userIdToExclusive:userIdToExclusive,
					databaseConfiguration:databaseConfiguration,
					shardHost:shardHost,
					sendToDevices:sendToDevices,
					settings:settings
				}));
			}).catch(reject);
		});
	}
})();