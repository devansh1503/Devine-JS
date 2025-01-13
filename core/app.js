const http = require('http')

class Devine{
    constructor(port){
        this.port = port
        this.requests = []
        this.server = http.createServer(this.requestListener)
    }
    listen(){
        this.server.listen(this.port, ()=>{
            console.log(`Server is running at http://localhost:${this.port}/`)
        })
    }
    get(){

    }
    post(){

    }
    put(){

    }
    patch(){

    }
    use(){

    }
    requestListener(req, res){

    }
}