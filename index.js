const RepositoriesHelper= require('repositories_helper');module.exports={
	get DalPms(){ return require('./backend/DalPms');},
	get PmsHandler(){ return require('./backend/PmsHandler');},
	get Pms(){ return getPms();},
	getScriptsRelativePath:RepositoriesHelper.getGetScriptsRelativePath(),
	getScriptsAbsolutePath:RepositoriesHelper.getGetScriptsAbsolutePath(),
	getStylesRelativePath:RepositoriesHelper.getGetStylesRelativePath(),
	getStylesAbsolutePath:RepositoriesHelper.getGetStylesAbsolutePath(),
	get ScriptsCatalogue(){ return require('./frontend/catalogues/ScriptsCatalogue');},
	initialize : function(params){
		return getPms().initialize(params);
	}
};
function getShards(){
	return require('./backend/Shards');
}
function getPms(){
	return require('./backend/Pms');
}