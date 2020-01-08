const RepositoriesHelper= require('repositories_helper');module.exports={
	get DalPms(){ return require('./backend/DalPms');},
	get PmsHandler(){ return require('./backend/PmsHandler');},
	get Pms(){ return require('./backend/Pms');},
	getScriptsRelativePath:RepositoriesHelper.getGetScriptsRelativePath(),
	getScriptsAbsolutePath:RepositoriesHelper.getGetScriptsAbsolutePath(),
	getStylesRelativePath:RepositoriesHelper.getGetStylesRelativePath(),
	getStylesAbsolutePath:RepositoriesHelper.getGetStylesAbsolutePath(),
	initialize : function(){
		return getShards().initialize.apply(null, arguments);
	}
};
function getShards(){
	return require('./backend/Shards');
}