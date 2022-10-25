import React from "react";
import BaseCol from './BaseCol'
import Relation from './Relation'
import RichText from './RichText'
import Select from './Select'
import Text from './Text'
import TextArea from './TextArea'
import {Typography} from '@mui/material';

const Components = {BaseCol,Relation,RichText,Select,Text,TextArea}


function InputSettings(props){
    if (typeof Components[props.inputType] !== "undefined") {
        return React.createElement(Components[props.inputType], { ...props })
    }else{
        return React.createElement(
            () => <></>
          );
    }
    
} 
export default function WithTitle(props){
    return <>
        {typeof Components[props.inputType] !== "undefined" ? <h3 style={{color: "#919eab"}}>Компонентийн тохиргоо</h3> : <></>}
        <InputSettings {...props}></InputSettings>
    </>
}
