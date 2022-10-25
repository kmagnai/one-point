const express=require("express");
const app=express();
const mongoose=require("mongoose");
const mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const defalutLimit=20;
const {conc,queryMaker,inQuery,toPipeline,setObjectId}=require('../../components/Query.js');
var pipeRooms={};
var roomPipes={};
var leavingRoom='';
var changeStreams={};
var listenDocument="";
var collectionPipes={};
var io = require('socket.io')(global.https); 
const client = new mongo("mongodb://root:MyNewPass88@localhost:27017", { useUnifiedTopology: true});
client.connect();
const db = client.db('db');
mongoose.connect("mongodb://root:MyNewPass88@localhost:27017", { useUnifiedTopology: true,useNewUrlParser: true});

const Post=mongoose.model('posts',{ title: String,stock: Number,web_id:Number()});
const mypost = new Post({ title: 'tite', stock:334,web_id:80});
mypost.save();
Post.find().exec((err,posts)=>{
    console.log('finded');
});
console.log('waiting')
io.on('connect', (socket) => {
  console.log('alhaj')
  socket.on('line', (line) => {
    socket.join(line);
  });
  socket.on('disconnect', function () {
      console.log('disconnect' + leavingRoom);
      //if leaving room undefined means user closed all tabs
      if(socket.adapter.rooms[leavingRoom]==undefined){
          var userPipes=roomPipes[leavingRoom];
          if(userPipes)
          for (const [pipe, value] of Object.entries(userPipes)){
            //leaving user from pipe
            delete pipeRooms[pipe][leavingRoom];
            
            //if no room then delete pipeline
            if(Object.keys(pipeRooms[pipe]).length==0){
                // changeStreams[pipe].close();
                // delete changeStreams[pipe];
                for (const [collection,pipelines] of Object.entries(collectionPipes)){
                    delete collectionPipes[collection][pipe];//////check correctance
                }
            } 
          }
          delete roomPipes[leavingRoom];
          
      }
  });
  socket.onclose = function(reason){
    //   console.log(socket.adapter.sids[socket.id]);
      for (const[room, value] of Object.entries(socket.adapter.sids[socket.id])) {
            leavingRoom=room;
      }
      Object.getPrototypeOf(this).onclose.call(this,reason);
  }
});
class DataStream{

    static  liveListen(pipeInfo){
            const collection = db.collection(pipeInfo.collection);
            const pipehash=pipeInfo.pipehash;
            var RTCODE=pipeInfo.RTCODE;
            
            listenDocument=pipeInfo.document;        
            if(pipeRooms[pipehash]==undefined){
                pipeRooms[pipehash]={}; 
            } 
            if(roomPipes[RTCODE]==undefined){
                roomPipes[RTCODE]={};
            }
            if(collectionPipes[pipeInfo.collection]==undefined){
                collectionPipes[pipeInfo.collection]={};
            }

            collectionPipes[pipeInfo.collection][pipehash]=pipeInfo;   
            roomPipes[RTCODE][pipehash]=1;
            pipeRooms[pipehash][RTCODE]=1;
            DataStream.sentRowsByPipehash(pipehash,pipeInfo,RTCODE);

            if(changeStreams[pipehash]==undefined){//if defined it means working already so don't need too create additional stream watchers
                
            }
    }
    
    
    static sentRowsByPipehash(pipehash,pipeInfo,RTCODE=null){
        const collection = db.collection(pipeInfo.collection);
        var total=0;
        console.log(JSON.stringify(pipeInfo.where));
        collection.countDocuments(pipeInfo.where,function(err, count){
            total=count;    
            var aggregate=[{$match:pipeInfo.where},{$skip:pipeInfo.skip},{$limit:pipeInfo.limit}];
            collection.aggregate(aggregate).toArray(function(err,result){
                    if (err) throw err;
                    var res={};
                    res['pipehash']=pipehash;
                    res['rows']=result;
                    res['total']=total;

                    if(RTCODE!=null){
                         var ret=io.sockets.in(RTCODE).emit('data-changed',res);
                    }else{
                        for(const [room, value] of Object.entries(pipeRooms[pipehash])) {
                                io.sockets.in(room).emit('data-changed',res);
                        }
                    }
            });        
        });
    
    }
    
    static insert(insertInfo){
        const collection = db.collection(insertInfo.collection);
        console.log(insertInfo.newDoc);
        
        var cpipes=collectionPipes[insertInfo.collection];
        
        collection.insertOne(insertInfo.newDoc);
        for (const[pipehash,pipeInfo] of Object.entries(cpipes)) {
            if(inQuery(insertInfo.newDoc,pipeInfo.where)){
                DataStream.sentRowsByPipehash(pipehash,pipeInfo);
            }
        }
    }
    static update(updateInfo){
        const collection = db.collection(updateInfo.collection);
        var updateWhere=setObjectId(updateInfo.where);
        collection.find(updateWhere).toArray(function(err,result){
        var cpipes=collectionPipes[updateInfo.collection];
            
            for (const[pipehash,pipeInfo] of Object.entries(cpipes)){
                for(var i=0;i<result.length;i++){
                    var row=result[i];
                    collection.updateOne(updateWhere,{"$set":updateInfo.set});
                    if(inQuery(row,pipeInfo.where)){
                        DataStream.sentRowsByPipehash(pipehash,pipeInfo);
                    }
                    var nrow=DataStream.setValues(row,updateInfo.set);
                    
                    if(inQuery(nrow,pipeInfo.where)){
                        DataStream.sentRowsByPipehash(pipehash,pipeInfo);
                    }
                }                
            }
        });
    }
    static setValues(row,update){
        var nrow=JSON.parse(JSON.stringify(row));//clonign
        for(const[ufield,uvalue] of Object.entries(update)){
            nrow[ufield]=uvalue;
        }
        return nrow;
    }
    static delete(deleteInfo){
        const collection = db.collection(deleteInfo.collection);
        const delWhere=setObjectId(deleteInfo.where);
        collection.find(delWhere).toArray(function(err,result){
            var cpipes=collectionPipes[deleteInfo.collection];
          
            for (const[pipehash,pipeInfo] of Object.entries(cpipes)) {
                for(var i=0;i<result.length;i++){
                    var row=result[i];
                    collection.deleteOne({'_id':ObjectId(row['_id'])})  
                    if(inQuery(row,pipeInfo.where)){
                        DataStream.sentRowsByPipehash(pipehash,pipeInfo);
                    }
                }
            }
        });
            
    }
}
module.exports =DataStream;
