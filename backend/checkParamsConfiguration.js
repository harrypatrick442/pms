const {DatabaseTypes} = require('enums');
module.exports = function(params){
	var overflowing = params.overflowing;
	var databaseType = params.databaseType;
	if(!overflowing)throw new Error('No overflow provided');
	if(!databaseType)throw new Error('No databaseType provied');
	if(databaseType===DatabaseTypes.SQL?overflowing:!overflowing)throw new Error('Invalid combination overflowing:'+overflowing+', databaseType:'+databaseType);
};