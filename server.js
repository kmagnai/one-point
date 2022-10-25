const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })
const handle = app.getRequestHandler()
const fs = require("fs");
const jwt = require('jsonwebtoken')
// ///database
const { MongoClient } = require("mongodb")
const { parseUrl } = require('next/dist/shared/lib/router/utils/parse-url')
const uri = "mongodb://localhost:27017?retryWrites=true&writeConcern=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
var mysql = require('mysql')

global.con = mysql.createConnection({
  host: "rio.mn",
  user: "current",
  password: "$weekly88",
  database: "magnai",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
const connectDb = async () => {
  await client.connect()
  global.db = client.db('actionDb')
  console.log('connected')
}
connectDb()
String.prototype.hashCode = function () {
  var hash = 0;
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

///database end  ******************************************

const httpsOptions = {
  key: fs.readFileSync("/var/www/certs/rio.mn/rio_mn.key"),
  cert: fs.readFileSync("/var/www/certs/rio.mn/rio.mn.crt"),
};
function authenticateToken(req, res) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    req.user = { level: 'finance', web_id: 80, id: 2334, token: 'abctoken' }
    return
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      // unverified
    }
    console.log('user generated for test')
    user.level = 'finance'
    user.web_id = 80
    user.id = 2334
    user.token = token
    req.user = user
  })
}


app.prepare().then(() => {
  
  global.server = createServer(httpsOptions, async (req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    // if(typeof global.Stream=='undefined')
    
    const parsedUrl = parse(req.url, true)
    authenticateToken(req, res)
    
    await handle(req, res, parsedUrl)
  
  })
  // global.Stream = require('./src/modules/StreamDb/Stream.js')

  global.server.listen(80, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:8080')
  })
})

