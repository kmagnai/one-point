import { types } from '../components/inputTypes/TYPES';
const fs = require('fs');
var modelFolder = './src/models/mongo/validation/';
const getSchema = collection => {
	return require('../models/mongo/validation/' + collection + '.json');
};

const isValid = fieldName => {
	return global.ajv.validate({ type: 'string', pattern: '^[a-zA-Z0-9_-]*$' }, fieldName);
};
const addField = (collection, fieldName, settings) => {
	var schema = getSchema(collection);
	if (typeof schema.properties[fieldName] !== 'undefined') {
		console.log('fieldName already exists');
		return 'Field name already exist ';
	}
	if (isValid(fieldName)) {
		schema.properties[fieldName] = {};
		if (!types.includes(settings.type)) {
			return { error: 'unknown type' };
		}
		schema.properties[fieldName].type = types[settings.type];

		let { serverSideValues } = require('../components/inputTypes/serverSide/' + settings.component);
		return serverSideValues(schema, collection, fieldName, settings, save, getSchema);
	} else {
		return { error: 'Zuvhun latin useg too baij bolno' };
	}
};

const deleteField = (collection, fieldName) => {
	var schema = getSchema(collection);
	if (typeof schema.properties[fieldName] != 'undefined') {
		if (typeof schema.properties[fieldName].component != 'undefined') {
			let { onDeleted } = require('../components/inputTypes/serverSide/' + schema.properties[fieldName].component);
			if (typeof onDeleted != 'undefined') {
				onDeleted(schema, collection, fieldName, save, getSchema);
			} 
			
		}
		delete schema.properties[fieldName];
		return save(collection,schema)
		
	} else {
		return { error: 'unknown field' };
	}
};
const save = (collection, schema) => {
	var filePath = modelFolder + '/' + collection + '.json';
	try {
		fs.writeFileSync(filePath, JSON.stringify(schema));
		return 1;
	} catch (err) {
		console.error(err);
	}
};

export { addField, getSchema, deleteField };
