const axios = require('axios')
const https=require("https")
export class dbModel{
    
   collection=''
   token
   #inst
   connect(base,username,password){
            /*
            1.login request and get token
            */
        if(this.collection==''){
            this.collection=this.constructor.name
        }    
        this.#inst = axios.create({
          baseURL: 'https://localhost:8081/'+this.collection
        });
        var token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidG9kZCIsImxldmVsIjoyMywiaWF0IjoxNjE2NDQxNTEzfQ.uMSYutrvZQTyxgVJmAws-xl3M6RbdrIKUx_gH8-WVN0'
        this.#inst.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const agent = new https.Agent({  
                  rejectUnauthorized: false
        })
        this.#inst.defaults.httpsAgent =agent
   }
   insert(data){
        this.#inst.post('',data).then(function(response){
            console.log('orchij bandia')
        }).catch(function(err){
            console.log('error bandia'+err)
        })
   }
   remove(){
       
   }
   update(){
       
   }
   select(newParams,options){
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
            this.#inst.get('',select).then(function(response){
                var posts=response.data
            }).catch(function(err){
                 console.log('error bandia'+err)
            })
   }
}

