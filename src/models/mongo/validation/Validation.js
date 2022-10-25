export default class Validation {
 
    name = ''
    compiled = null

    addSchema() {
        global.ajv.addSchema(this.schema, this.name)
        return global.ajv
    }

    errors = null

    validate(doc){
        if(this.compiled==null){
            var ajv=this.addSchema()
            this.compiled = ajv.compile(this.schema)
        }   
        if ( this.compiled(doc)) {
            return 1
        } else {
            this.errors =  this.compiled.errors
            return false
        }
    }

}
