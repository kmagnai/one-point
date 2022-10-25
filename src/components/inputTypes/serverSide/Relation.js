var relationTypes = {
	integer: [ 'OneToOne', 'OneToMany' ],
	Array: [ 'ManyToMany', 'ManyToOne' ],
	Object: [ 'OneToOne', 'OneToMany' ],
};
var serverSideValues = (schema, collection, fieldName, settings, save, getSchema) => {
	var compValues = schema.properties[fieldName];

	if (typeof settings.foreignField != 'undefined' && settings.foreignField != '') {
		settings.relType += 'Both';
	}
	compValues.type = settings.type;
	compValues.relType = settings.relType;
	compValues.foreignCollection = settings.foreignCollection;
	compValues.foreignField = settings.foreignField;
	compValues.component=settings.component
	setRef(compValues, schema);
	var fs = foreignSave(collection, fieldName, settings, save, getSchema);

	if (fs == 1) {
		return save(collection, schema);
	} else {
		return 0;
	}
};
var setRef = (settings, schema) => {
	var hasRef = false;
	if (typeof schema.refs == 'undefined') {
		schema.refs = [];
	}
	if (settings.type == 'array') {
		if (!schema.refs.includes(settings.foreignCollection)) {
			schema.refs[schema.refs.length] = settings.foreignCollection;
		}
		settings = { type: 'array', items: { $ref: settings.foreignCollection,component:"Relation"} };
	}
	if (settings.type == 'object') {
		settings = { $ref: settings.foreignCollection, ...settings,component:"Relation" };
		delete settings.type;
		if (!schema.refs.includes(settings.foreignCollection)) {
			schema.refs[schema.refs.length] = settings.foreignCollection;
		}
	}
	return settings;
};
var getForeignType = (settings, fieldName) => {
	if (settings.relType.indexOf('ToOne') != -1) {
		if (fieldName.substring(fieldName.length - 3) == '_id') {
			return 'integer';
		} else {
			return 'object';
		}
	} else {
		return 'array';
	}
};
var relTypeReverse = {
	OneToManyBoth: 'ManyToOneBoth',
	ManyToOneBoth: 'OneToManyBoth',
	ManyToManyBoth: 'ManyToManyBoth',
	OneToOneBoth: 'OneToOneBoth',
};
const onDeleted=(schema, collection, fieldName, save, getSchema)=>{
		var foreignCollection=schema.properties[fieldName].foreignCollection
		var foreignField=schema.properties[fieldName].foreignField
		
		var foreignSchema=getSchema(foreignCollection);

		delete foreignSchema.properties[foreignField]
		save(foreignCollection,foreignSchema)
}
var foreignSave = (collection, fieldName, settings, save, getSchema) => {
	var collection_reverse = collection.slice(); //cloning
	collection = settings.foreignCollection.slice();
	var compValues = { type: 'object' };
	compValues.relType = relTypeReverse[settings.relType];
	compValues.foreignCollection = collection_reverse;
	compValues.foreignField = fieldName;
	
	var schema = getSchema(collection);
	compValues.type = getForeignType(compValues, settings.foreignField);
	compValues = setRef(compValues, schema);
	schema.properties[settings.foreignField] = compValues;
	return save(collection, schema);
};
export { serverSideValues, foreignSave,onDeleted };
