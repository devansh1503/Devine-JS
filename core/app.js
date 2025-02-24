const http = require('http')
const Response = require('./response')
const mysql = require('mysql2')
const ModelClass = require('./orm/ModelClass')
const TableManager = require('./orm/TableManager')
const UserService = require('./auth/userService')
const AuthService = require('./auth/authService')
const Request = require('./request')

class Devine{
    constructor(port, JWT_SECRET=null){
        this.port = port
        this.JWT_SECRET = JWT_SECRET
        this.requests = new Map()
        this.middlewares = []
    }
    listen(){
        // Creating server in listen because we want routes and method to be populated before the server starts
        this.server = http.createServer((req, res)=>{
            // this.requestListener(req, res)
            this.executeMiddlewares(req, res);
        })
        this.server.listen(this.port, ()=>{
            console.log(`Server is running at http://localhost:${this.port}/`)
        })
    }
    parseUrl(url){
        let parsedUrl = url.split('?')[0]
        parsedUrl = parsedUrl.replace(/\/:\w+/g, '')
        return parsedUrl.slice(-1)=='/'?parsedUrl : parsedUrl+'/'
    }
    get(route, callBack){
        const parsedUrl = this.parseUrl(route)
        this.requests.set(`GET-${parsedUrl}`, callBack)
    }
    post(route, callBack){
        const parsedUrl = this.parseUrl(route)
        this.requests.set(`POST-${parsedUrl}`, callBack)
    }
    // Need to think a solution here
    auth(route, req, res){
        const parsedUrl = this.parseUrl(route)
        this.requests.set(`POST-${parsedUrl}`, (req, res)=>{
            
        })
    }
    register(route, req, res){
        const parsedUrl = this.parseUrl(route)
        this.requests.set(`POST-${parsedUrl}`, (req, res)=>{

        })
    }
    // put(){

    // }
    // patch(){

    // }
    use(callBack){
        this.middlewares.push(callBack)
    }
    executeMiddlewares(req, res){
        let idx = 0;
        const next = () => {
            if(idx < this.middlewares.length){
                const middleware = this.middlewares[idx++];
                middleware(req, res, next);
            }
            else{
                this.requestListener(req, res)
            }
        }
        next()
    }
    async requestListener(req, res){
        const auth = await this.authenticate(req)
        if(auth){

            const parsedUrl = this.parseUrl(req.url)
            const key = `${req.method}-${parsedUrl}`
            const responseObj = new Response(res, req)
            const requestObj = new Request(req)
            let callback = this.requests.get(key)
            if (!callback) {
                for (let [mapKey, handler] of this.requests){
                    if(key.startsWith(mapKey)){
                        callback = handler
                        break;
                    }
                }
                if(!callback){
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Route not found');
                    return;
                }
            }
            callback(requestObj, responseObj)
        }
        else{
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Authentication Credentials Not Found');
            return;
        }
    }

    async authenticate(req){
        if(!this.JWT_SECRET) return true;
        const token = req.headers('Authorization')?.split(' ')[1];
        if(token){
            const validation = new AuthService().verifyToken(token, this.JWT_SECRET)
            return validation;
        }
        else{
            return false;
        }
    }

    async connectDb(creds){
        return new Promise((resolve, reject) =>{ 
            const connection = mysql.createConnection({
                host: creds?.host,
                user: creds?.user,
                password: creds?.password
            })
            connection.connect((err)=>{
                if(err){
                    console.log("Error Connecting to MySQL:", err)
                    reject({"connection":false})
                    return;
                }
                console.log("Connection to MySQL successfull!")
                if(creds?.database){
                    connection.query(`CREATE DATABASE IF NOT EXISTS ${creds.database}`, (err, result) => {
                        if(err) {
                            console.error("Error Creating Database- ", err);
                            reject({"connection":false})
                            return;
                        }
                        connection.changeUser({database:creds.database}, (err) => {
                            if(err){
                                console.error("Error Switching to Database: ", err);
                                reject({"connection":false});
                            }
                            console.log(`Changed to database- ${creds.database}`)
                            resolve({"connection":true})
                        })
                    })
                }
            })
            this.connection = connection
        })
    }
    async getOrCreateModel(schema){
        const table = new ModelClass(this.connection)
        await table.createTableIfNotExists(schema)
        return new TableManager(schema.title, this.connection)
    }
    // execute(query){
    // }
}

module.exports = Devine