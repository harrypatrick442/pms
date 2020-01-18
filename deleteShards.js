const DalPms = require('./backend/DalPms');
const configuration = require('configuration');
const Core = require('core');
const Iterator = Core.Iterator;
const DalHosts = require('hosts').DalHosts;
const DalDatabases = require('dal').DalDatabases;
DalPms.initialize(configuration.getPmsDatabase());
DalHosts.initialize(configuration.getDatabase());
DalPms.getShards(()=>{ throw new Error('Should not ba calling');}).then((shards)=>{
	var iteratorShards = new Iterator(shards);
	next();
	function next(){
		if(!iteratorShards.hasNext()){
			console.log('done');
			process.exit();
			return;
		}
		var shard = iteratorShards.next();
		DalDatabases.deleteDatabase(shard.getShardHost().getDatabaseConfiguration(), shard.getName()).then(()=>{
			DalPms.deleteShards([shard.getId()]).then(()=>{
				next();
			}).catch(error);
		}).catch(error);
	}
}).catch(error);
function error(err){
	console.error(err);
}