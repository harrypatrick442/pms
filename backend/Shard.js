module.exports = function(params){
	const userIdToExclusive = params.userIdToExclusive;
	const userIdFromInclusive = params.userIdFromInclusive;
	const databaseConfiguration = params.databaseConfiguration;
	if(!userIdFromInclusive)throw new Error('No userIdFromInclusive provied');
	if(!userIdToExclusive)throw new Error('No userIdToExclusive provied');
	if(!databaseConfiguration)throw new Error('No databaseConfiguration provied');
	if(!(databaseConfiguration instanceof DatabaseConfiguration))databaseConfiguration = new DatabaseConfiguration(databaseConfiguration);
	const DalPmsShard = new DalPmsShard(databaseConfiguration);
	const pmsAccumulator = new PmsAccumulator();
	this.getUserIdToExclusive = function(){
		return userIdToExclusive;
	};
	this.getUserIdFromInclusive = function(){
		return userIdFromInclusive;
	};
	this.add = function(){
		pmsAccumulator.add();
	};
	this.get = function(){
		
	};
};