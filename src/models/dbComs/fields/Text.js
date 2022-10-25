import {useContext,useEffect} from 'react'
import insertContext from '../../../context/InsertContext'

export default function Text(props){
    const vari= useContext(insertContext)
    const field={}
    var val='odo'
    
    field[props.field]=val
    useEffect(()=>{
       vari.addField(field)  
    },[])
    
    const setValueToContainer=(event)=>{
        console.log(event.target.value)
        field[props.field]=event.target.value
        console.log('calling by value'+event.target.value)
        vari.addField(field)
    }
    return (
        <div>
            <input onchange='setValueToContainer()'  type='text'/>
        </div>
    )
}