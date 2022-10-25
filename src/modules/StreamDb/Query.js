var ObjectId = require('mongodb').ObjectID;
function conc(q,con='&&',varName='row',row){
        query='';
        for(var i=0; i<q.length;i++){
            query+=queryMaker(q[i],varName,row);
            if(i!=q.length-1){
                query+=' '+con+' ';
            }
        }  
        return query;
}
function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}
function queryMaker(qobj,varName='row',row){
    query='';
    for(const [fieldName, value] of Object.entries(qobj)) {
                var imp='&&'
                if(Array.isArray(value) && fieldName!='$or' && fieldName!='$and' && fieldName!='$in'){//in operator
                    
                    continue;   
                }else if(fieldName=='$or' || fieldName=='$and'){
                
                    if(fieldName=='$or'){
                        imp='||';
                    }
                    if(query=='')
                        query+="("+conc(value,imp,varName,row)+")";
                    else
                        query+=' && ('+conc(value,imp,varName,row)+')';
                    continue;
                }
                
                if(query!=''){
                    query+=' '+imp+' ';
                }
           
                var op="==";
                var newVal=value;
                if(typeof value === 'object' && !Array.isArray(value)){
                    var oper='';
                    for(const [operator, inVal] of Object.entries(value)){
                            oper=operator;//give it to ouside of loop
                            newVal=inVal;
                            switch(operator){
                                case '$lt':
                                    op="<";
                                    break;
                                case '$gt':
                                    op=">";
                                    break;
                                case '$el':
                                    op="<="
                                    break;
                                case '$eg':
                                    op=">=";
                                    break;
                                case '$ne':
                                    op='<>';
                                    break;
                                case '$in':
                                    var inOp=newVal.includes(row[fieldName]);
                                    console.log(newVal);
                                    query+=inOp;
                                    break;
                            }
                    }
                    if(oper=='$in' || oper=='$nin'){
                        continue;
                    }
                }
                if(!Number.isInteger(newVal)){
                    newVal='\''+newVal+'\'';
                }
                query+=varName+'.'+fieldName+op+newVal;
              
        }
    return query;
}
function toPipeline(qobj){
    
    var sb='{';
    var eb='}'
    if(Array.isArray(qobj)){
        sb='[';
        eb=']';
    }
    var query=sb;

    for(const [fieldName, value] of Object.entries(qobj)) {
        var fn=fieldName;
        var operators=['$or','$and','$lt','$gt','$lte','$gte','$ne','$nin'];
        if(!operators.includes(fieldName)){
            fn='fullDocument.'+fn;
        }
    
        val='';
        if(typeof value === 'object'){
            val=toPipeline(value);
        }else{
      
            if(!isNaN(value)){
                val=parseInt(value);    
            }else{
                val='"'+value+'"'; 
            }
        }
        if(query!=sb)
            query+=',';
        if(sb=='['){
            query+=val;
        }else{
            query+='"'+fn+'":'+val;
        }
     
    }
    return query+eb;
}
function setObjectId(query){
    for(const [fieldName, value] of Object.entries(query)){
      
        if(fieldName=='_id'){
    
            query[fieldName]=ObjectId(value);
        }
        if(typeof(value)=='object' || Array.isArray(value)){
            query[fieldName]=setObjectId(value);
        }
    }
    return query;
}
function inQuery(row,query){
    if(JSON.stringify(query)=="{}"){
        return true;
    }
    cQuery=queryMaker(query,'row',row);
   
    exCode = 'var cond='+cQuery+';';
    eval(exCode);
  
    return cond;
}
module.exports = {
	conc,
	queryMaker,
	inQuery,
	toPipeline,
	setObjectId
};
