const Devine = require("../core/app")
const cors = require('cors')

const app = new Devine(3000);

app.use(cors())

app.use(()=>{
    console.log("This is a middleware")
})

app.get('/', (req, res)=>{
    res.status(200).send("<html><body><h1>Hello World</h1><body></html>");
})

app.listen()