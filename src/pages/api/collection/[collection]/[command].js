import { addField, getSchema,deleteField } from '../../../../models/collection';

export default function handler(req, res) {
	switch (req.query.command) {
		case 'fields':
			var schema = getSchema(req.query.collection);
			res.json(schema);
			break;
		case 'addField':
			res.send(addField(req.query.collection, req.body.fieldName, req.body.settings));
			break;
		case 'deleteField':
			res.send(deleteField(req.query.collection,req.body.fieldName))
			break;
		case 'selectForEdit':
			var { collection,fieldName } = req.query
			var schema = getSchema(collection)
			
			break;
		default:
			res.end('not Set');
	}
}
