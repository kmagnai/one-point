const axios = require('axios')
import { useState } from 'react'
const ajv = require('../validation/index.js')

class Model {
    name
    url
    state
    currengAgg = { match: {} }
    options
    uniq = 1
    setter
    validator = null
    setCount
    static uniq = -1
    static objects = []
    constructor(name) {
        this.name = name
        this.url = '/api/stream/' + this.name
    }
    setState(value) {
        let [data, setData] = this.state
        setData(value)
    }

    static getUniq() {
        return this.uniq++
    }
    static dataChanged(data) {
        Object.entries(data.variables).forEach(entry =>{
               var [varName,value]=entry
               var uniq = parseInt(varName)
               Model.objects[uniq].setter(data['result'])
               if ("count" in data) {
                    Model.objects[uniq].setCount(data['count'])
               }
        })

    }

    updateAgg() {
        var uniq = this.uniq
        var newAgg = this.currengAgg
        var setter = this.setter
        var options = this.options
        onSocketConnected().then(onCon => {
            this.live(newAgg, options)
        })
    }
    match(newMatch = null, clear) {
        if (newMatch != null) {
            if (clear)
                this.currengAgg.match = newMatch
            else
                this.currengAgg.match = { ...this.currengAgg.match, ...newMatch }
            this.updateAgg()
        }
        return this.currengAgg.match
    }
    limit(count = -1) {
        if (count != -1) {
            this.currengAgg.limit = count
            this.updateAgg()
        }
        return this.currengAgg.limit
    }
    skip(c = -1) {
        if (c != -1) {
            this.currengAgg.skip = c
            this.updateAgg()
        }
    }
    live(agg, options) {
       
        if(Array.isArray(options)){
            var newOptions={}
            if(options.length > 0)
            {
                newOptions.setter=options[0]
            }
            if(options.length > 1){
                newOptions.setCount=options[1]
            }
            options=newOptions
        }
        var setter = options.setter
        if (this.uniq != -1) {
            this.uniq = Model.getUniq()
        }
        if (typeof setter == 'undefined') {
            throw 'Live function called without setter live(agg,setter)';
        }
        this.setter = setter
        var uniq = this.uniq
        Model.objects[uniq] = this
        this.currengAgg = agg
        this.options = options
        global.onSocketConnected().then(onCon => {
            var sendOptions = {}
            if("oneRow" in options){
                sendOptions.oneRow=1
            }
            if ("setCount" in options) {
                sendOptions.setCount = 1
                this.setCount = options.setCount
            }
            this.fetch(agg, { live: true, socketId: socket.id, variable: uniq, ...sendOptions }).then(res => {
                setter(res['result'])
                if ("setCount" in options)
                    options.setCount(res['count'])
            })
        })
    }

    async fetch(agg, options) {
     
        return new Promise((resolve, reject) => {
            var p = { params: { agg, options } }
      
            axios.get(this.url, p).then(function (response) {
                resolve(response.data)
            }).catch(function (err) {
                reject(err)
            })
        })

    }
    async insert(doc, setProcess = () => { }, setErrors = () => { }, setInsertedId = () => { }) {
    

        if (this.validator.validate(doc)) {
            setErrors({})
            axios.post(this.url, doc).then(res => {
                var data = res.data
                if (data.acknowledged) {
                    setProcess('success')
                    setInsertedId(data.insertedId)
                } else {
                   
                }
            })
        } else {
       
            this.onError(setProcess,setErrors)
        }

    }
    onError( setProcess = () => { }, setErrors = () => { }){
        setProcess('error')
        var messages={}
        this.validator.errors.forEach((message) => {
            if (message.instancePath == '') {
                message.instancePath = 'required'
            }
            if (messages.hasOwnProperty(message.instancePath)) {
                var len = messages[message.instancePath].length
                messages[message.instancePath][len] = message
            } else {
                messages[message.instancePath] = []
                messages[message.instancePath][0] = message
            }
        })
        setErrors(messages)
    }
    async update(set, where, setProcess = () => { }, setErrors = () => { }) {
        if (this.validator.validate(set)){
            setErrors({})
            axios.put(this.url, {set,where}).then(res => {
                var data = res.data
                setProcess('success')
            })
        }else{
            this.onError(setProcess,setErrors)
        }
    }
    async delete(where, options = {}) {
        axios.delete(this.url, { data: { where, options } })
    }

}
export { Model as CModel }