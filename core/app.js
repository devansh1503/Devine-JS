const http = require('http')
const Response = require('./response')

class Devine{
    constructor(port){
        this.port = port
        this.requests = new Map()
    }
    listen(){
        // Creating server in listen because we want routes and method to be populated before the server starts
        this.server = http.createServer((req, res)=>{
            this.requestListener(req, res)
        })
        this.server.listen(this.port, ()=>{
            console.log(`Server is running at http://localhost:${this.port}/`)
        })
    }
    get(route, callBack){
        this.requests.set(`GET-${route}`, callBack)
    }
    post(route, callBack){
        this.requests.set(`POST-${route}`, callBack)
    }
    // put(){

    // }
    // patch(){

    // }
    // use(){

    // }
    requestListener(req, res){
        const key = `${req.method}-${req.url}`
        const responseObj = new Response(res, req)
        const callback = this.requests.get(key)
        if (!callback) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Route not found');
            return;
        }
        callback(req, responseObj)
    }
}

module.exports = Devine