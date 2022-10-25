var serverSideValues = (schema, collection, fieldName, settings, save, getSchema) => {
    return save(collection, schema)
}
export {serverSideValues}