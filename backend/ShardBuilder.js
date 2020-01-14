module.exports = new (function(params){
	const path = require('path');
	const PmsLog = require('./PmsLog');
	const DalDatabases = require('dal').DalDatabases;
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
	this.build = function(params){
		const userIdFromInclusive = params.userIdFromInclusive;
		if(!userIdFromInclusive)throw new Error('No userIdFromInclusive provided');
		const userIdToExclusive = params.userIdToExclusive;
		if(!userIdToExclusive)throw new Error('No userIdToExclusive provided');
		const shardHost = params.shardHost;
		if(!shardHost)throw new Error('No host provided');
		const name = 'pms_'+userIdFromInclusive+'_'+userIdToExclusive;
		return new Promise((resolve, reject)=>{
			var newDatabaseConfiguration;
			console.log(shardHost.getDatabaseConfiguration().toJSON());
			createDatabase(shardHost.getDatabaseConfiguration(), name).then((newDatabaseConfigurationIn)=>{
				newDatabaseConfiguration = newDatabaseConfigurationIn;
				populateDatabaseWithProgrammabes().then(()=>{
					var shard = new Shard({
						userIdFromInclusive:userIdFromInclusive,
						userIdToExclusive:userIdToExclusive,
						databaseConfiguration:newDatabaseConfiguration,
						shardHost:shardHost
					});
					shard.update().then(()=>{
						resolve(shard);
					}).catch(error);
				}).catch(error);	
			}).catch(error);
			
			function error(err){
				if(newDatabaseConfiguration){
					DalDatabases.deleteDatabase(newDatabaseConfiguration).then(doReject).catch((err)=>{
						PmsLog.error(new Error('Error deleting database '+newDatabaseConfiguration.getDatabase()+' while cleaning up after creating new shard faile'));
						doReject();
					});
					return;
				}
				doReject();
				function doReject(){
					//pmsLog.error(err);
					reject(err);
				}
			}
		});
	};
	function createDatabase(currentDatabaseConfiguration, name){
		return DalDatabases.createDatabase(currentDatabaseConfiguration, name);
	}
	function populateDatabaseWithProgrammables(){
		return new Promimse((resolve, reject)=>{
			getProgrammables().then((programmables)=>{
				var iterator = new Iterator(programmables);
				nextProgrammable();
				function nextProgrammable(){
					if(!iterator.hasNext()){
						resolve();
						return;
					}
					var programmable = iterator.next();
					populateDatabaseWithProgrammable(programmable).then(nextProgrammable).catch(reject);
				}
			}).catch(reject);
		});
	}
	function populateDatabaseWithProgrammable(){
		return DalProgrammability.executeDefinition(programmable.getCreateDefinition());
	}
	function getProgrammables(){
		return new Promise((resolve, reject)=>{
			var programmables =[];
			var iteratorProgrammablePaths = new Iterator(programmablePaths);
			next();
			function next(){
				if(!iteratorProgrammablePaths.hasNext()){
					resolve(programmables);
					return;
				}
				var programmablePath = iteratorProgrammablePaths.next();
				Programmable.fromFile(programmablePath).then((programmable)=>{
					programmables.push(programmable);
					next();
				}).catch(reject);
			}
		});
	}
})();