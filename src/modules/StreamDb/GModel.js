
//work in both side browser and server CModel works in browser,Model works in server both extends GModel
class GModel{

    validate(doc) {
     if (this.validator == null) {
         if(this.schema==null){
            
         }
         if (this.schema != null) {
             this.validator = ajv.compile(this.schema)
         } else {
             this.validator = () => { }
         }
     }
     return this.validator(doc)
 }
}