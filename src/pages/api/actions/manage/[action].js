const actions={
    'add_order':['sh_order','sh_order_detail'],
    'on_delivery':['sh_product','warehouse_product','delivery_man_stock']
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    var actionName=req.query.action

    actions[actionName].forEach(modelName=>{
        var model=require('../../../../models/dbModels/'+modelName)
        if(typeof model[actionName]=='function'){
            model[actionName](req,res)
        }
    })
    
    var model=require('../../../../models/posts')
    if(typeof res.resObject !=='undefined'){
        res.send('defined')
    }else{
        res.send('undefined')  
    } 
  }
  
}