const axios = require('axios')
const callAction=(actionName,data)=>{
    return axios.post('http://rio.mn:8080/api/actions/'+actionName, data)
}
export default callAction