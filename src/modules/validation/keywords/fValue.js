export default function fValue(ajv){
  ajv.addKeyword({
  keyword: "fValue",
  validate: (schema,data,parentSchema)=>{
        return true;
      }
  })
  return ajv
}