const axios = require('axios')
const https=require("https")
export default class Select{
    
   collection=''
   token
   inst
   selectParams={ "fields":{},
                    "where":{},
                    "limit":{},
                    "skip":0,
   }
   options={}
   constructor(from='',params=null,options=null,baseURL='http://rio.mn:8080/api/fetch',token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidG9kZCIsImxldmVsIjoyMywiaWF0IjoxNjE2NDQxNTEzfQ.uMSYutrvZQTyxgVJmAws-xl3M6RbdrIKUx_gH8-WVN0'){
            /*
            1.login request and get token
            */
       
        if(from!=''){
            this.from(from)
        }
        if(params!=null){
            this.params(params)
        }
        if(options!=null){
            this.options(options)
        }
        this.inst = axios.create({
          baseURL: baseURL
        });

        this.inst.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const agent = new https.Agent({  
                  rejectUnauthorized: false
        })
        this.inst.defaults.httpsAgent =agent
   }
   from(collection){
       this.collection=collection
       return this
   }
   params(newParams){
       this.selectParams={
           ...this.selectParams,
           ...newParams,
       }
       return this
   }
   options(newOptions){
       this.options={
           ...this.options,
           ...newOptions,
       }
       return this
   }
   fetch(){
            var json =
            {
                "select":
                {
                    ...this.selectParams,
                },
                ...this.options
            }
            let select={
                params:json
            }
            var result={}
            return this.inst.get('/'+this.collection,select)
            
   }
}

