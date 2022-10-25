export default function relation(ajv){
  console.log('i works')
  ajv.addKeyword({
  keyword: "relation",
  validate: (schema,data,parentSchema)=>{
        return true;
      }
  })
  return ajv
}