const student = {
    "title":"Student",
    "fields":{
        "name": {
            "type":String,
            "reqd":true,
        },
        "roll_no":{
            "type":Number,
            "reqd":true,
            "unique":true
        },
        "age":{
            "type":Number,
        },
        "grade":{
            "type":Number,
            "reqd":true,
        },
        "standard":{
            "type":Number,
            "reqd":true,
        },
        "subjects":{
            "type":Array,
            // "reqd":true
        }
    }
}

// ONE TO MANY
const standard = {
    "title":"Standard",
    "fields":{
        "name":{
            "type":Number,
            "reqd":true,
        },
        "strength":{
            "type":Number,
            "reqd":true,
        }
    }
}

// MANY TO MANY
const subject = {
    "title":"Subject",
    "fields":{
        "name":{
            "type":String,
            "reqd":true,
        },
    }
}

module.exports={student, standard, subject}