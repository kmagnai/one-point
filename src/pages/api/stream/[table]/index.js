import { getModel } from '../../../../models/mongo/getModel.js'


export default function handler(req, res) {
    const { table } = req.query
    var model = getModel(table, req, res)
    var ids = [];

    const roleName = model.levelRoles[req.user.level]

    switch (req.method) {

        case 'GET':
            if (typeof req.query.agg == 'undefined')
                req.query.agg = "{}"
            if (typeof req.query.options == 'undefined')
                req.query.options = "{}"

            var agg = JSON.parse(req.query.agg)
            var options = JSON.parse(req.query.options)
            agg = model.secureAgg(agg, req)
            model.fetch(agg, options).then(result => {
                res.json(result)
            }, err => {
                res.json(err);
                res.status(405).end();
            })
            break;
        case 'POST':
            if(model.blockDirectInsert){
                res.send("Direct insert not allowed in model")
            }
            var newDoc = req.body
            newDoc = model.replaceMerge(model.insertRoles[roleName], newDoc)
            newDoc = model.replaceMerge(model.staticFields[roleName], newDoc)
            newDoc = model.setResourcesValue(newDoc, req)

            model.insert(newDoc).then(result => {
                res.json(result)
            }, err => {
                console.log(err)
                res.json({ error: 1, messages: err })
            })
            break;
        case 'PUT':
            if(model.blockDirectUpdate){
                res.send("Direct insert not allowed in model")
            }
            var set = req.body.set
            var where = req.body.where

            where = model.replaceMerge(model.updateRoles[roleName].where, where)
            where = model.replaceMerge(model.staticFields[roleName], where)
            where = model.setResourcesValue(where, req)


            set = model.replaceMerge(model.updateRoles[roleName].set, set)
            set = model.replaceMerge(model.staticFields[roleName], set)
            set = model.setResourcesValue(set, req)
            model.update(set, where).then(r => {
                res.send(r)
            })


            break;
        case 'DELETE':
            model.delete(req, res)
            res.send('done')
            break;
    }
}