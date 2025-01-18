const Devine = require('../../core/app')
const {student, standard, subject} = require('./model')

const creds = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'demo'
}
const app = new Devine(3000)
app.connectDb(creds)

const Student = await app.getOrCreateModel(student)
const Standard = await app.getOrCreateModel(standard)
const Subject = await app.getOrCreateModel(subject)

app.get('/student', (req, res)=>{
    res.send(Student.find());
})

app.post('/student', async (req, res)=>{
    try{
        const data = req.body;
        await Student.create({
            "name":data.name,
            "roll_no":data.roll_no,
            "grade":data.grade,
            "standard":data.standard,
        }).then((result)=>{
            console.log(result);
            res.send(result)
        }).catch((err)=>{
            console.log(err)
        })
    }
    catch(err){
        console.log(err)
    }
})

app.listen()