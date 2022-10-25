export default function input(ajv) {
	ajv.addKeyword({
		keyword: 'input',
	});
    ajv.addKeyword({
		keyword: 'collection',
	});
    ajv.addKeyword({
		keyword: 'values',
	});
	ajv.addKeyword({
		keyword: 'relType',
	});
	ajv.addKeyword({
		keyword: 'foreignField',
	});
	ajv.addKeyword({
		keyword: 'foreignCollection',
	});
	return ajv;
}
