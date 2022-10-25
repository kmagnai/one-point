const axios = require('axios')
const https=require("https")
class Select{
    
   collection=''
   token
   inst
   connect(username,password){
    
        this.inst = axios.create({
          baseURL: 'https://localhost:8081'
        });
        var token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidG9kZCIsImxldmVsIjoyMywiaWF0IjoxNjE2NDQxNTEzfQ.uMSYutrvZQTyxgVJmAws-xl3M6RbdrIKUx_gH8-WVN0'
        this.inst.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const agent = new https.Agent({  
                  rejectUnauthorized: false
        })
        this.inst.defaults.httpsAgent =agent
   }

   fetch(collection,newParams,options){
            var json =
            {
                "select":
                {
                    "fields":{},
                    "where":{},
                    "limit":{},
                    "skip":0,
                    ...newParams,
                },
                ...options
            }
            let select={
                params:json
            }
            return this.inst.get('/'+collection,select)
   }
}

export default async function handler(req, res) {
    var select=new Select()
    select.connect()
    var start=Date.now()
    await select.fetch(req.query.collection,req.query.select).then(function(result){
        res.json(result.data)   
        console.log(Date.now()-start)
    }).catch(function(error){
        res.send()
    })
    
}