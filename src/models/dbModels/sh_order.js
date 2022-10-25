import {dbModel} from './dbModel.js'
class sh_order extends dbModel{
    
    collection='posts'
    add_order=function(req,res){
        this.connect()
        this.insert({"title":'fromServer','stock':23,'web_id':80})
        console.log('hello')
    }
    
}
module.exports=new sh_order()