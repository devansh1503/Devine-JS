const Devine = require('../core/app')

const app = new Devine(3000)

app.get('/apicall/alph/:id', async(req, res)=>{
    const response = {
        body : await req.body(),
        query: req.query(),
        params: req.params(),
        ip: req.ip(),
        method: req.method(),
        url: req.url(),
        protocol: req.protocol(),
        baseUrl: req.baseUrl(),
        originalUrl: req.originalUrl()
    }
    res.send(response)
})

app.listen()