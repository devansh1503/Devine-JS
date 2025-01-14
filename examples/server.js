const Devine = require("../core/app")

const app = new Devine(3000);

app.get('/', (req, res)=>{
    res.status(200).send("<html><body><h1>Hello World</h1><body></html>");
})
app.get('/json', (req, res)=>{
    res.send({"result":"Hello World"});
})
app.get('/str', (req, res)=>{
    res.send("Hello World");
})

app.post('/posting', (req, res)=>{
    const data = req.body
    res.send(data);
})

app.listen()