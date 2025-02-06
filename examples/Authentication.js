const Devine = require('../core/app')

// Prefer storing the JWT Secret in env variables
const app = new Devine(3000, "my-jwt-secret");

app.auth(
    '/auth', req, res
)
app.register(
    '/register', req, res
)



app.listen()