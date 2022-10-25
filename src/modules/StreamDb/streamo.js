
var ObjectId = require('mongodb').ObjectID
const defalutLimit = 20
var hash = require('object-hash')
const { conc, queryMaker, inQuery, toPipeline, setObjectId } = require('./Query.js')
var changeStreams = {}
var listenDocument = ""

var collectionPipes = {}
var socketCollection = {}
var io = require('socket.io')(global.server);
var socketIds = {}

io.on('connect', (socket) => {
    console.log('socket connected TO the server' + socket.id)
    socketIds[socket.id] = 1
    socket.on('disconnect', function () {
        console.log('disconnected')
        if (socketCollection[socket.id] !== undefined) {
            for (const [collectionName, aggHash] of Object.entries(socketCollection[socket.id])) {
                delete collectionPipes[collectionName][aggHash].sockets[socketId]
                if(collectionPipes[collectionName][aggHash].sockets.length==0){
                   delete collectionPipes[collectionName][aggHash]
                }
            }
            delete socketCollection[socket.id]
        }
        delete socketIds[socket.id]
    });

});

class Stream {
    static unique=0

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
    static listenDocument(collectionName, agg, options) {

        let socketId = options.socketId
        let variable = options.variable
        let aggHash=JSON.stringify({ agg, oneRow:options.oneRow }).hashCode()
        if (socketIds[socketId] !== 1) {
            //socket not connecte 
            return;
        }
        if (collectionPipes[collectionName] == undefined)
            collectionPipes[collectionName] = {}
 
            
        if (collectionPipes[collectionName][aggHash] == undefined)
            collectionPipes[collectionName][aggHash] ={ agg, options,sockets:{} }

        collectionPipes[collectionName][aggHash]['sockets'][socketId] =1//socket id iin orond agg bh yostoi met neg agg olon ajiluulah shaardlagatai bolj bna

        if (socketCollection[socketId] == undefined)
            socketCollection[socketId] = {}
        socketCollection[socketId][collectionName] = aggHash

    }

    static sendData(collectionName, data, collection) {
        var cpipes = collectionPipes[collectionName];
        if (cpipes == undefined) {
            return
        }
        var aggResult = []

        for (const [socketId, socketPipes] of Object.entries(cpipes)) {
          
            for (const [varName, varInfo] of Object.entries(socketPipes)) {
                var socketIdVar = socketId + "_" + varName
                var agg = varInfo.agg
                var options = varInfo.options
                //ohh forgton lines may protects insertmany then send many            
                if (agg[0]["$match"] !== undefined && inQuery(data, agg[0]["$match"])) {
                    
                    // aggResult = this.findCache(collectionName, agg)
                    // if (aggResult == false) {
                    var model = models[collectionName]
                    model.fetch(agg, options,false).then(result => {
                        result.varName=varName
                        io.to(socketId).emit('dataChanged', result)
                        addCache('posts',{d:1},result)
                        console.log(cache)
                    }).catch(error => {
                        //in case something goes wrong in the catch block (as vijay) commented
                    })

                } else if (agg[0]["$match"] == undefined) {
                    io.to(socketId).emit('dataChanged', { 'msg': "match undefined" })
                }
            }
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
