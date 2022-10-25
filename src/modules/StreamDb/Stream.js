
var ObjectId = require('mongodb').ObjectID
const defalutLimit = 20
var hash = require('object-hash')
const { conc, queryMaker, inQuery, toPipeline, setObjectId } = require('./Query.js')
var changeStreams = {}
var listenDocument = ""

var collectionPipes = {}
var socketCollection = {}
var socketVars = {}
var io = require('socket.io')(global.server);
var socketIds = {}
var emits={}
io.on('connect', (socket) => {
    socketIds[socket.id] = 1
    socket.on('disconnect', function () {

        if (socketCollection[socket.id] !== undefined) {
            for (const [collectionName, aggHash] of Object.entries(socketCollection[socket.id])) {
        
                delete collectionPipes[collectionName][aggHash].sockets[socket.id]

                if (Object.keys(collectionPipes[collectionName][aggHash].sockets).length == 0) {
                    delete collectionPipes[collectionName][aggHash]
                }

            }
            delete socketCollection[socket.id]
        }
        delete socketIds[socket.id]

    });

});

class Stream {
    static unique = 0

    static findCache(cname, agg) {
        var hashCode = hash(agg)
        if (!cache.hasOwnProperty(cname))
            return false

        if (!cache[cname].hasOwnProperty(hashCode))
            return false

        return cache[cname][hashCode]
    }
    static setCache(cname, agg, result) {
        var hashCode = hash(agg)
        if (!cache.hasOwnProperty(cname))
            cache[cname] = {}
        cache[cname][hashCode] = result
    }
    static removeVar(collectionName, socketId, variable) {
        let varIndex = socketId + "_" + variable
        if (socketVars[varIndex] != undefined) {
            let oldHash = socketVars[varIndex]
            delete collectionPipes[collectionName][oldHash]['sockets'][socketId][variable]
            if (Object.keys(collectionPipes[collectionName][oldHash]['sockets'][socketId]).length == 0) {
                delete collectionPipes[collectionName][oldHash]['sockets'][socketId]
                if (Object.keys(collectionPipes[collectionName][oldHash]['sockets']).length == 0) {
                    delete collectionPipes[collectionName][oldHash]
                }
            }
        }

    }
    static listenDocument(collectionName, agg, options) {
      
        let socketId = options.socketId
        let variable = options.variable
        let aggHash = JSON.stringify({ agg, oneRow: options.oneRow }).hashCode()
        let varIndex = socketId + "_" + variable
        Stream.removeVar(collectionName, socketId, variable)

        socketVars[varIndex] = aggHash
        if (socketIds[socketId] !== 1) {
            //socket not connecte 
            return;
        }

        if (collectionPipes[collectionName] == undefined)
            collectionPipes[collectionName] = {}


        if (collectionPipes[collectionName][aggHash] == undefined){
            if(typeof agg[0]["$match"] =='undefined'){
                
            }
            collectionPipes[collectionName][aggHash] = { agg, options, sockets: {} }
        }
        if (collectionPipes[collectionName][aggHash]['sockets'][socketId] == undefined) {
            collectionPipes[collectionName][aggHash]['sockets'][socketId] = {}
        }
        collectionPipes[collectionName][aggHash]['sockets'][socketId][variable] = 1//socket id iin orond agg bh yostoi met neg agg olon ajiluulah shaardlagatai bolj bna
   
        if (socketCollection[socketId] == undefined)
            socketCollection[socketId] = {}
        socketCollection[socketId][collectionName] = aggHash

    }
    static doEmit(){
        console.log(emits)
        for (const [socketId, value] of Object.entries(emits)){
            
            for (const [jvariable, result] of Object.entries(emits[socketId])){
                io.to(socketId).emit('dataChanged', result)
               
            }
            delete emits[socketId]
        }
    }
    static async sendData(collectionName, data) {
        var cpipes = collectionPipes[collectionName];
        if (cpipes == undefined) {
            return
        }

        var aggResult = []
        var model = models[collectionName]
     
        for (const [aggHash, aggSockets] of Object.entries(cpipes)) {

            var agg = aggSockets.agg
            var options = aggSockets.options
            options.live = false
            if (agg[0]["$match"] !== undefined && inQuery(data, agg[0]["$match"])) {
               return new Promise((resolve, reject) => {
                model.fetch(agg, options, false).then(result => {
                    for (let [socketId, variables] of Object.entries(aggSockets.sockets)) {
                        result.variables = variables
                        if(typeof emits[socketId]=='undefined'){
                            emits[socketId]={}
                        }
                        emits[socketId][JSON.stringify(variables).hashCode()]=result
                        resolve()
                    }
                })
                })
            
            }


            // for (const [varName, varInfo] of Object.entries(socketPipes)) {
            //     var socketIdVar = socketId + "_" + varName
            //     var agg = varInfo.agg
            //     var options = varInfo.options
            //     //ohh forgton lines may protects insertmany then send many            
            //     if (agg[0]["$match"] !== undefined && inQuery(data, agg[0]["$match"])) {

            //         // aggResult = this.findCache(collectionName, agg)
            //         // if (aggResult == false) {
            //         var model = models[collectionName]
            //         model.fetch(agg, options,false).then(result => {
            //             result.varName=varName
            //             io.to(socketId).emit('dataChanged', result)
            //             addCache('posts',{d:1},result)
            //             console.log(cache)
            //         }).catch(error => {
            //             //in case something goes wrong in the catch block (as vijay) commented
            //         })

            //     } else if (agg[0]["$match"] == undefined) {
            //         io.to(socketId).emit('dataChanged', { 'msg': "match undefined" })
            //     }
            // }
        }
    }
    getCount(agg) {
        var countAgg = {}
        if ("$match" in agg[0]) {
            countAgg = agg[0]["$match"]
        }
        return this.collection.find(countAgg).count()
    }



}
module.exports = Stream
