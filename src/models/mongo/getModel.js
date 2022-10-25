var getModel;
global.models = [];
global.schemas={}
const getValidator = table => {
	try {
		var schema=addSchema(table);
		return global.ajv.compile(schema);
	} catch (error) {
		console.log(error);
	}
};

const addSchema=(name)=>{
	if(!global.schemas.hasOwnProperty(name)){
		var schema=require('./validation/' + name + '.json');
		global.schemas[name]=1
		global.ajv.addSchema(schema,name)
		if (typeof schema.refs !== 'undefined' && Array.isArray(schema.refs)) {
			schema.refs.map(refName => {
				addSchema(refName);
			});
		}
		return schema
	}
}
if (typeof window != 'undefined') {
	getModel = table => {
		if (models[table] == undefined) {
			let { CModel } = require('../../modules/StreamDb/CModel.js');
			models[table] = new CModel(table);
			models[table].validator = getValidator(table);
		}
		return models[table];
	};
} else {
	getModel = table => {
		if (models[table] == undefined) {
			try {
				console.log(table);
				models[table] = require('./' + table + '.js');
				models[table].validator = getValidator(table);
			} catch (error) {
				console.log(error);
				return null;
			}
		}
		return models[table];
	};
}
export { getModel };
