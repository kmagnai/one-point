export default function refs(ajv){
    ajv.addKeyword({
    keyword: "refs",
    })
    return ajv
  }