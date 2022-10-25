const fs = require('fs')
var valFolder = './src/models/mongo/validation/';
var modelFolder='./src/models/mongo/'
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export default function handler(req, res) {
	if (global.ajv.validate({ type: 'string', pattern: '^[a-zA-Z0-9_-]*$' }, req.body.name)) {
        var filePath=valFolder + req.body.name+'.json'
		if (!fs.existsSync(filePath)) {
			var content={
				type:"Object",
				properties:{

				}
			}
            fs.writeFile(filePath,JSON.stringify(content),function(err){
				if(err) res.send(err)
				var code="import { Model } from '../../modules/StreamDb/Model.js';class "+req.body.name+" extends Model {}var model = new "+req.body.name+"('"+req.body.name+"');module.exports = model"
				var codePath=modelFolder+req.body.name+'.js'
				fs.writeFile(codePath,code,function(cerr){
					if(cerr) res.send(cerr)

					res.send("1")
				})
			
			})
		}else{
			console.log('ner davhardsan')
            res.send("Нэр давхардсан");    
        }
	} else {
		console.log('invalid')
		console.log('Зөвхөн үсэг тоо,-,_ байж болно');
	}
	
}
