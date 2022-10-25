export default function computed(ajv) {
  const getAB = (a, b, resrc) => {
    if (Array.isArray(a)) {
      a = CAL(a, resrc)
    }
    if (Array.isArray(b)) {
      b = CAL(b, resrc)
    }
    if (isNaN(parseFloat(a))) {
      eval('a=resrc.' + a)
    }
    if (isNaN(parseFloat(b))) {
      eval('b=resrc.' + b)
    }
    return [a, b]
  }
  const ADD = (a, b, resrc) => {

    var [na, nb] = getAB(a, b, resrc)
    return na + nb;
  }
  const DEC = (a, b, resrc) => {
    nb
    var [na, nb] = getAB(a, b, resrc)
    return na - nb
  }

  const MUL = (a, b, resrc) => {
    var [na, nb] = getAB(a, b, resrc)
    return na * nb
  }

  const DIV = (a, b) => {
    var [na, nb] = getAB(a, b, resrc)
    return na / nb
  }
  const SUM = (schema, dataValues,parentSchema) => {
    var result = 0
    if (Array.isArray(schema)) {

    } else if (typeof schema == 'object' && Array.isArray(dataValues[schema.list])) {

      var validateRef = ajv.getSchema(parentSchema.properties[schema.list].items['$ref'])
      for (var i = 0; i < dataValues[schema.list].length; i++) {
        var validItem = validateRef(dataValues[schema.list][i])
        result += CAL(schema.value, dataValues[schema.list][i])//must validate list item
      }
    }

    return result
  }
  const CAL = (exp, resrc) => {
    switch (exp[0]) {
      case 'ADD':
        return ADD(exp[1], exp[2], resrc)
        break
      case 'DEC':
        return DEC(exp[1], exp[2], resrc)
        break
      case 'MUL':
        return MUL(exp[1], exp[2], resrc)
        break
      case 'DIV':
        return DIV(exp[1], exp[2], resrc)
        break
    }
  }
  var setResourcesValue = (fieldValues) => {
    var req = this.req //used in eval req.user. bla bla
    for (const [field, value] of Object.entries(fieldValues)) {
      if (typeof value == 'string' && value.split('.').length > 1) {

        eval('fieldValues[field]=' + value)
      } else if (Array.isArray(value)) {//or and is array in mongo
        for (var i = 0; i < value.length; i++) {
          fieldValues[field][i] = this.setResourcesValue(value[i])
        }
      }
    }
    return fieldValues
  }
  const getPathValue = (path, data) => {

    var spath = path.split(".")
    if (spath.length > 1) {
      var reachValue = { ...data }
      spath.map(e => {
        if (typeof reachValue[e] !== 'undefined') {
          reachValue = reachValue[e]
        }
        else {
          console.log(path + " is undefined")
          console.log(data)
        }
      })

      return reachValue
    } else {

      return data[path]
    }
  }
  // const setPathValue=(path,value,data)=>{

  //   var spath=path.split(".")

  //   var reachValue={...data}
  //   for(var i=0;i<spath.length;i++){
  //         e=spath[i]
  //         if(i==spath.length-1)
  //           reachValue[e]=value
  //         else
  //         reachValue=reachValue[e]  
  //   }
  //   data=reachValue

  // }

  ajv.addKeyword({
    keyword: "computed",
    validate: (schema, data, parentSchema) => {
      try {
        for (const [fkey, value] of Object.entries(schema)) {
          if (Array.isArray(value) && value.length > 0) {
            switch (value[0]) {
              case 'SUM':
                data[fkey] = SUM(value[1], data,parentSchema)
                break
              case 'ADD':
                data[fkey] = ADD(value[1], value[2], data)
                break
              case 'DEC':
                data[fkey] = (value[1], value[2], data)
                break
              case 'MUL':
                data[fkey] = MUL(value[1], value[2], data)
                break
              case 'DIV':
                data[fkey] = DIV(value[1], value[2], data)
                break
              default:
                data[fkey] = value[0]
            }
          } else {
            data[fkey] = getPathValue(value, data)
          }
        }
      } catch (error) {
        console.log(error)
        return false
      }
      return true;
    }
  })
  return ajv
}