module.exports = function(){
	const DalPmsShard = new DalPmsShard();
	const pmsAccumulator = new PmsAccumulator();
	this.add = function(){
		pmsAccumulator.add();
	};
	this.get = function(){
		
	};
};