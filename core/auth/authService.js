const jwt = require('jsonwebtoken')

class AuthService{
    generateToken(user, time, JWT_SECRET){
        return jwt.sign(
                {...user},
                JWT_SECRET,
                {expiresIn:time}
        )
    }
    verifyToken(token, JWT_SECRET){
        return jwt.verify(token, JWT_SECRET)
    }
}
module.exports = AuthService