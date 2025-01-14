var send = require('send')

class Response{
    constructor(res, req){
        this.res = res
        this.req = req
    }
    send(body){
        let chunk = body;
        let encoding = 'utf8'

        if(typeof chunk === 'string'){
            this.res.setHeader('Content-Type', 'text/html')
        }
        else if(Buffer.isBuffer(chunk)){
            this.res.setHeader('Content-Type', 'application/octet-stream')
        }
        else if(typeof chunk === 'object'){
            chunk = JSON.stringify(chunk)
            this.res.setHeader('Content-Type', 'application/json')
        }
        else if(chunk === null){
            chunk = ''
        }

        if(chunk !== undefined){
            const length = Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk, encoding);
            this.res.setHeader('Content-length', length)
        }

        // TODO: this logic is not resetting chunk to empty string
        switch(this.res.statusCode){
            case 205:
                this.res.setHeader('Content-Length', '0');
                this.res.removeHeader('Transfer-Encoding');
                chunk = ''; 
                break;
            case 204:
            case 304:
                this.res.removeHeader('Content-Type');
                this.res.removeHeader('Content-Length');
                this.res.removeHeader('Transfer-Encoding');
                chunk='';
                break;
        }
        if(this.req.method === 'HEAD'){
            this.res.end();
            return this.res
        }

        this.res.end(chunk, encoding)
        return this
    }
    status(code){
        if (!Number.isInteger(code)) {
            throw new TypeError(`Invalid status code: ${JSON.stringify(code)}. Status code must be an integer.`);
        }
        if (code < 100 || code > 999) {
            throw new RangeError(`Invalid status code: ${JSON.stringify(code)}. Status code must be greater than 99 and less than 1000.`);
        }
        this.res.statusCode = code;
        return this;
    }
    // TODO: Complete this method
    sendFile(path, options, callBack){
        callBack = callBack
        opts = options || {}
        if (!path) {
            throw new TypeError('path argument is required to res.sendFile');
        }
    
        if (typeof path !== 'string') {
            throw new TypeError('path must be a string to res.sendFile')
        }

        // support function as second arg
        if (typeof options === 'function') {
            callBack = options;
            opts = {};
        }

        var pathname = encodeURI(path)
        var file = send(this.req, pathname, opts)
    }
    render(view, options, callBack){
        var app = this.req.app;
        var done = callBack;
        var opts = options || {};
        var req = this.req;

        if (typeof options === 'function') {
            done = options;
            opts = {};
        }

        opts._locals = this.res.locals

        done = done || function(err, str){
            if (err) return req.next(err);
            this.send(str);
        };

        app.render(view, opts, done);
        
    }
    location(url){
        return this.setHeader('Location', encodeURI(url))
    }
    redirect(url){
    }

}

module.exports = Response