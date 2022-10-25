const fs = require('fs');

var modelFolder = './src/models/mongo/validation';

export default function handler(req, res) {
	fs.readdir(modelFolder, (err, files) => {
        var valFiles=[]
		files.forEach(file => {
            var ext=file.substring(file.length-5,file.length)
            var name=file.substring(0,file.length-5)
            if(ext=='.json'){
                valFiles[valFiles.length]=name
            }
        });
        res.json(valFiles);
	});
	
}
