# Devine.js Documentation

## Introduction
**Devine.js** is a lightweight and powerful Node.js framework designed to simplify backend development. It provides a seamless interface for handling HTTP requests, middleware integration, and database operations using its built-in ORM.

---

## Installation
To use Devine.js, install it via npm:
```sh
npm install devine-js
```

---

## Getting Started
### Hello World Example
Create a simple server using Devine.js:

```js
const Devine = require("devine-js");

const app = new Devine(3000);

app.get('/', (req, res) => {
    res.status(200).send("<html><body><h1>Hello World</h1></body></html>");
});

app.get('/json', (req, res) => {
    res.send({"result": "Hello World"});
});

app.get('/str', (req, res) => {
    res.send("Hello World");
});

app.listen();
```

---

## Request Handling
Devine.js provides methods to handle different HTTP request types.

### Example:
```js
const Devine = require("devine-js");

const app = new Devine(3000);

app.get('/apicall/alph/:id', async (req, res) => {
    const response = {
        body: await req.body(),
        query: req.query(),
        params: req.params(),
        ip: req.ip(),
        method: req.method(),
        url: req.url(),
        protocol: req.protocol(),
        baseUrl: req.baseUrl(),
        originalUrl: req.originalUrl()
    };
    res.send(response);
});

app.listen();
```

---

## Middleware Support
Devine.js allows middleware integration for request processing.

### Example:
```js
const Devine = require("devine-js");
const cors = require('cors');

const app = new Devine(3000);

app.use(cors());

app.use(() => {
    console.log("This is a middleware");
});

app.get('/', (req, res) => {
    res.status(200).send("<html><body><h1>Hello World</h1></body></html>");
});

app.listen();
```

---

## ORM (Object-Relational Mapping)
Devine.js includes a built-in ORM for database management.

### Defining Models:
Create a `model.js` file:

```js
const student = {
    "title": "Student",
    "fields": {
        "name": { "type": String, "reqd": true },
        "roll_no": { "type": Number, "reqd": true, "unique": true },
        "age": { "type": Number },
        "grade": { "type": Number, "reqd": true },
        "standard": { "type": Number, "reqd": true },
        "subjects": { "type": Array }
    }
};

const standard = {
    "title": "Standard",
    "fields": {
        "name": { "type": Number, "reqd": true },
        "strength": { "type": Number, "reqd": true }
    }
};

const subject = {
    "title": "Subject",
    "fields": {
        "name": { "type": String, "reqd": true }
    }
};

module.exports = { student, standard, subject };
```

### Connecting to Database:
In `index.js`, establish a database connection and define routes.

```js
const Devine = require("devine-js");
const { student, standard, subject } = require("./model");

const creds = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'demo'
};

var Student, Standard, Subject;

const app = new Devine(3000);

const connect = async () => {
    try {
        const res = await app.connectDb(creds);
        if (res.connection) {
            Student = await app.getOrCreateModel(student);
            Standard = await app.getOrCreateModel(standard);
            Subject = await app.getOrCreateModel(subject);
        } else {
            console.log(res);
        }
    } catch (err) {
        console.log(err);
    }
};
connect();

app.get('/student', (req, res) => {
    res.send(Student.find());
});

app.post('/student', async (req, res) => {
    try {
        var data = req.body;
        await Student.create({
            "name": data.name,
            "roll_no": data.roll_no,
            "grade": data.grade,
            "standard": data.standard,
        }).then(() => {
            res.send("Data Created!");
        }).catch(err => {
            res.send(err);
        });
    } catch (err) {
        console.log(err);
    }
});

app.listen();
```

---

## Conclusion
Devine.js simplifies backend development with its intuitive API and built-in ORM. It allows developers to create scalable and efficient applications with minimal boilerplate code.

For more details, stay tuned for upcoming updates!

