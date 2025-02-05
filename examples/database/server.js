const Devine = require('../../core/app')
const {student, standard, subject} = require('./model')

const creds = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'demo'
}
var Student;
var Standard;
var Subject;

const app = new Devine(3000)

const connect = async ()=>{
    try{
        const res = await app.connectDb(creds);
        if(res.connection){
            Student = await app.getOrCreateModel(student)
            Standard = await app.getOrCreateModel(standard)
            Subject = await app.getOrCreateModel(subject)
        }
        else{
            console.log(res)
        }
    }
    catch(err){
        console.log(err);
    }
}
connect()

app.get('/student', (req, res)=>{
    res.send(Student.find());
})

app.post('/student', async (req, res)=>{
    try{
        var data = req.body;
        data = {
            "name":"Devansh",
            "roll_no":"22",
            "grade":"10",
            "standard":"10"
        }
        await Student.create({
            "name":data.name,
            "roll_no":data.roll_no,
            "grade":data.grade,
            "standard":data.standard,
        }).then((result)=>{
        }).catch((err)=>{
            res.send(err)
            return;
        })
        res.send("Data Created!")
    }
    catch(err){
        console.log(err)
    }
})

app.listen()