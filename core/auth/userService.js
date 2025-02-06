const bcrypt = require('bcryptjs')

class UserService{
    async hashPassword(password){
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }
    async comparePassword(password, hashedPassword){
        return await bcrypt.compare(password, hashedPassword)
    }
}
module.exports = UserService