var ObjectId = require('mongodb').ObjectID;
const { setObjectId } = require('./Query.js');

var ajv = require('../validation/index.js')



/*
caaan dooo uun do
*/
class Model {

    defaultLimit = 50;
    maxLimit = 200;
    allCondition = { 'LOGGED': { 'web_id': '234' } };
    resources = [];
    name = 'post'
    collection
    testvar
    req
    validator = null
    schema = null
    blockDirectInsert=false
    blockDirectUpdate=false
    live(agg, setState) {

    }
    selectRoles = {
        'role1': {
            "where": {},
            "denyFields": { "web_id": -1 }
        },
        'role2': { "where": { "web_id": '$req.user.web_id', "user_id": '$req.user.id' } }
    }
    role1={
        select:{},
        update:{},
        delete:{},
        insert:{}
    }
    updateRoles = {
        'role1': {
            "where": { 'web_id': '$req.user.web_id' },
            "set": { 'web_id': '$req.user.web_id' }
        },
        'role2': {
            "where": { 'web_id': '$req.user.web_id' },
            "set": { 'web_id': '$req.user.web_id' }
        }
    }
    insertRoles = {
        'role1': { "web_id": '$req.user.web_id', "user_id": '$req.user.id' },
        'role2': { "web_id": '$req.user.web_id' }
    }
    deleteRoles = {
        'role1': { "web_id": '$req.user.web_id' }
    }
    staticFields = {
        // 'role1':{"web_id":'req.user.web_id'},
        'role2': { "web_id": '$req.user.web_id' }
    }
    levelRoles = {
        'finance': 'role1'
    }
    levels = {
        'basic': {
            'staticFields': { 'web_id': '$session.web_id' },
            //   'selectRoles'=>['stock'=>['_lt'=>20]],
            'denyFields': { 'insert': ['_id'], 'update': ['_id'] }
        }
    };
    allowedFields = { 'basic': { 'insert': {}, 'update': '', 'delete': '' } };
    denyFields = {};
    // var $roles=['NotLogged'=>'mediumAccess']; 
    currentUserRoles = [];
    constructor(name) {
        if (typeof name == 'undefined') {
            console.log('Collection name is empthy')
            return
        }
        this.name = name
        this.collection = global.db.collection(name)
    }

    toInt(state) {
        return state !== null && state !== undefined && !isNaN(parseInt(state)) ? parseInt(state) : 0
    }
    setResourcesValue(fieldValues, req) {
        //used in eval req.user. bla bla
        for (const [field, value] of Object.entries(fieldValues)) {

            
            if (typeof value == 'string' && value.split('.').length > 1 && value.charAt(0) == '$') {
               
                eval('fieldValues[field]=' + value.substring(1))
            } else if (Array.isArray(value)) {//or and is array in mongo
             
                for (var i = 0; i < value.length; i++) {
                    fieldValues[field][i] = this.setResourcesValue(value[i])
                }
            }
         
        }
        return fieldValues
    }
    replaceMerge(highWhere, lowWhere) {
        if (highWhere === undefined) {
            highWhere = {}
        }
        if (lowWhere === undefined) {
            lowWhere = {}
        }
        for (const [field, value] of Object.entries(highWhere)) {
            lowWhere[field] = value
        }
        return lowWhere
    }
    //aggregation
    secureAgg(reqAgg, req) {
        let agg = []
        const roleName = this.levelRoles[req.user.level]
        var where = this.replaceMerge(this.selectRoles[roleName].where, reqAgg.match)
      

        where = this.replaceMerge(this.staticFields[roleName], where)
    
        where = this.setResourcesValue(where)
    
        if (JSON.stringify(where) != '{}') {
          
            // where = setObjectId(where)
            
            agg.push({ "$match": where })
        }
        var limit = this.toInt(reqAgg.limit)
        if (limit > this.maxLimit) {
            limit = this.maxLimit
        }
        if (limit < 1) {
            limit = this.defaultLimit
        }

        agg.push({ $skip: this.toInt(reqAgg.skip) })
        agg.push({ $limit: limit })


        return agg
    }
    // function resolveAfter2Seconds(x) {
    //     return new Promise(resolve => {
    //       setTimeout(() => {
    //         resolve(x);
    //       }, 2000);
    //     });
    //   }
    async fetch(userAgg, options, secureIt = true) {
        
        var name = this.name
        var obj = this
        var agg = [{ '$match': {} }, { '$skip': 0 }, { '$limit': 5 }]
        userAgg.map(aggItem => {
            if (typeof aggItem['$match'] != 'undefined') {
                agg[0]['$match'] = aggItem['$match']
            }
            if (typeof aggItem['$skip'] != 'undefined') {
                agg[1]['$skip'] = aggItem['$skip']
            }
            if (typeof aggItem['$limit'] != 'undefined') {
                agg[2]['$limit'] = aggItem['$limit']
            }
        })
       
        return new Promise((resolve, reject) => {
            try {
                if (options.oneRow) {
                    this.collection.findOne(agg[0]['$match']).then((result) => {
                        resolve({ result })
                        if (options !== undefined && options.live == 1) {
                            Stream.listenDocument(name, agg, options)
                        }
                    })
                } else {
                    console.log(agg,this.name)
                    this.collection.aggregate(agg).toArray(function (err, result) {
                        if (options !== undefined && options.live == 1) {
                            Stream.listenDocument(name, agg, options)
                        }
                        if ("setCount" in options) {
                            obj.getCount(agg).then((count) => {
                                resolve({ result, count })
                            })
                        } else {
                            resolve({ result })
                        }
                    })
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }
    getCount(agg) {
        var countAgg = {}
        if ("$match" in agg[0]) {
            countAgg = agg[0]["$match"]
        }
        return this.collection.find(countAgg).count()
    }

    async insert(newDoc) {
        var name = this.name
        var isValid = this.validator.validate(newDoc)
        var collection = this.collection
        return new Promise((resolve, reject) => {
            if (isValid) {
                collection.insertOne(newDoc, function (err, result) {
                    if (err) {
                        reject(err)
                        return
                    }
                    Stream.sendData(name, newDoc, collection).then(()=>{
                        Stream.doEmit()
                    })
                   
                    resolve(result)
                })
            } else {
                reject(this.validator.errors)
            }
        })
        // Stream.sendData(name, newDoc, this.collection)
    }
    async update(newValues, where) {
        var name = this.name
        where = setObjectId(where)
        var collection = this.collection
        var replaceMerge = this.replaceMerge
        delete newValues['_id']
        return new Promise((resolve, reject) => {
            this.collection.find(where).toArray(function (err, result) {
                if (result.length > 500) {
                    res.send(this.name + ' Cant update more than 1000 documents at once')
                }
                if (result.length == 1) {
                    collection.updateOne(where, { "$set": newValues }).then(r => {
                        resolve(r)
                    })
                } else {
                    collection.updateMany(where, { "$set": newValues }).then(r => {
                        resolve(r)
                    })
                }
                var last=null
                result.forEach(function (doc) {
                    Stream.sendData(name, doc, collection)
                    var newRow = replaceMerge(newValues, doc)
                    last=Stream.sendData(name, newRow, collection)
                });
                last.then(()=>{
                    Stream.doEmit()
                })
                
            })
        })

    }
    async delete(req, res) {
        var name = this.name
        const roleName = this.levelRoles[req.user.level]
        var where = req.body.where
        var delOne = false
        var collection = this.collection
        if (!(where instanceof Object)) {
            if (this.isJSON(where)) {
                where = JSON.parse(where)
            } else {
                delOne = true
                where = { _id: where }
            }
        }

        if (roleName in this.deleteRoles) {

            where = this.replaceMerge(this.deleteRoles[roleName].where, where)
            where = this.replaceMerge(this.staticFields[roleName], where)
            where = setObjectId(where)
            var obj = this
            if (delOne) {

                collection.findOne(where, function (err, result) {
                    if (result) {
                        obj.deleteOne(result).then(function(){
                            Stream.sendData(name, result).then(()=>{
                                Stream.doEmit()
                            })
                           
                        })

                        
                    }
                })
            } else {
                
                this.collection.find(where).toArray(function (err, result) {
                    var last=null
                    result.forEach(doc => {
                        obj.deleteOne(doc)
                        last=Stream.sendData(name, doc)
                    })
                    if(last!=null){
                        last.then(()=>{
                            Stream.doEmit()
                        })
                    }
                    
                })
            }

        } else {
            res.send('Accies denied')
        }

    }
    deleteOne(doc) {
        var where = { _id: doc._id }
        if (!Number.isInteger(doc._id)) {
            where = setObjectId(where)
        }
        return this.collection.deleteOne(where)
    }
    isJSON(str) {
        try {
            return (JSON.parse(str) && !!str);
        } catch (e) {
            return false;
        }
    }

}
export { Model }