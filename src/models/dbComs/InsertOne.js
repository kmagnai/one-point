import {useState,useContext} from 'react'
import insertContext from '../../context/InsertContext'

const InsertOne =(props)=>{
    const model=props.model
    var [fields,setFields]=useState({'age':30})
    var cons=""
    const addField=(newField)=>{
        var newVal={...fields,...newField}
        setFields(newVal)
    }
    const insert=()=>{
        model.insert()    
    }
    const clFields=()=>{
        console.log(fields)
    }
    return (
        <insertContext.Provider value={ {fields,addField} }>
        {cons}  {props.children}
        <button onClick={clFields}>cl fields</button>
        </insertContext.Provider>
    )

}
export default InsertOne