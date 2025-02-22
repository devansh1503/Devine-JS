const http = require("http")
const { resolve } = require("path")
const url = require("url")

class Request{
    constructor(req){
        this.req = req
        this.parsedUrl = url.parse(req.url, true)

    }
    async body(){
        let body = []
        for await (const chunk of this.req){
            body.push(chunk)
        }
        body = Buffer.concat(body).toString()
        if(this.req.headers['content-type'] === 'application/json'){
            return JSON.parse(body)
        }
        else if(this.req.headers['content-type'] === 'application/x-www-form-urlencoded'){
            let params = new URLSearchParams(body)
            let entries = params.entries();
            return Object.fromEntries(entries)
        }
    }

    query(){
        return this.parsedUrl.query;
    }
    params(){
        const pathParts = this.parsedUrl.pathname.split("/").filter(Boolean);
        return pathParts.length > 1 ? pathParts[pathParts.length - 1] : null
    }
    get(){

    }
    cookies(){

    }
    signedCookies(){

    }
    path(){

    }
    hostname(){

    }
    protocol(){
        return this.req.connection.encrypted ? "https" : "http"
    }
    url(){
        return this.parsedUrl.pathname
    }
    originalUrl(){
        return this.req.url
    }
    baseUrl(){
        const host = this.req.headers.host || "";
        return `${this.req.connection.encrypted ? "https": "http"}://${host}`
    }
    method(){
        return this.req.method
    }
    is(){

    }
    ip(){
        return this.req.headers['x-forwarded-for'] || this.req.connection.remoteAddress
    }
}

module.exports = Request