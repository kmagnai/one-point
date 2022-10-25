import relation from './keywords/relation.js'
import computed from './keywords/computed.js'
import fValue from './keywords/fValue.js'
import refs from './keywords/refs.js'
import input from './keywords/input.js'
const addFormats = require("ajv-formats")
const Ajv = require("ajv")
var ajv = new Ajv({coerceTypes: true,allErrors: true}) 
ajv=relation(ajv)
ajv=computed(ajv)
ajv=refs(ajv)
ajv=fValue(ajv)
ajv=input(ajv)
addFormats(ajv)
global.ajv=ajv
module.exports = exports = ajv