const Pms =require('./../../index');
const PMS='/pms/';
const ScriptsCatalogue = {
	Pm :{src:'Pm.js', folder:PMS, repository:Pms},
	PmMessage :{src:'PmMessage.js', folder:PMS, repository:Pms},
	PmMessagesViewModel :{src:'PmMessagesViewModel.js', folder:PMS, repository:Pms},
	PmMessageViewModel :{src:'PmMessageViewModel.js', folder:PMS, repository:Pms},
	 PmMessagesView :{src:'PmMessagesView.js', folder:PMS, repository:Pms},
	 PmMessageView :{src:'PmMessageView.js', folder:PMS, repository:Pms},
	 _Pms :{src:'Pms.js', folder:PMS, repository:Pms},
	 PmsEntryView :{src:'PmsEntryView.js', folder:PMS, repository:Pms},
	 PmsEntryViewModel :{src:'PmsEntryViewModel.js', folder:PMS, repository:Pms},
	 PmsView :{src:'PmsView.js', folder:PMS, repository:Pms},
	 PmsViewModel :{src:'PmsViewModel.js', folder:PMS, repository:Pms},
	 PmView :{src:'PmView.js', folder:PMS, repository:Pms},
	 PmViewModel :{src:'PmViewModel.js', folder:PMS, repository:Pms},
	 PmWindowView :{src:'PmWindowView.js', folder:PMS, repository:Pms},
	 PmsDisplayModes :{src:'PmDisplayModes.js', folder:PMS, repository:Pms}
 };
 ScriptsCatalogue.getArray =()=>{
	return Object.values(ScriptsCatalogue).filter(value=>typeof(value)!=='function');
 };
 module.exports = ScriptsCatalogue;