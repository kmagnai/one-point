import { Model } from '../../modules/StreamDb/Model.js'

class sh_category_property extends Model {
    schema={
        property:{
            sh_product_category_id:{
                type:"integer"
            }
        }
    }
}
var model = new sh_category_property('sh_category_property')
module.exports = model