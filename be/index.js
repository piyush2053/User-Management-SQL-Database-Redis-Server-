const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2')

const app = express();

app.use(cors());
app.use(bodyparser.json());

app.listen(3000, () => {
    console.log('BE Running at Port 3000');
})

//connection to Database 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'users',
    port: 3306
})
//checking connection............
db.connect(err => {
    if (err) {
        console.log("404 - Error Connecting to Database")
    } else {
        console.log("Database Connection Successful !")
    }
})

//get data from DB
app.get("/users", (req, res) => {
    console.log("Api running to fetch users");
    let qrr = `SELECT * FROM user order by id;`;
    db.query(qrr, (err, results) => {
        if (err) {
            console.log("Error", err);
        }
        if (results.length > 0) {
            res.send({
                message: "All users Data",
                data: results
            });
        }
    });
})
//name and image by email
app.get("/name/:email", (req, res) => {
    let email = req.params.email;
    console.log(email)
    console.log("Api running to fetch name by email");
    let qrr = `SELECT name,netImg FROM user WHERE email ='${email}';`;
    db.query(qrr, (err, results) => {
        if (results.length>0) {
            res.send({
                data: results[0].name,
                body: results[0].netImg
            });
        }
        else{
            res.send({
                message: "Error No email given"
            })
        }
    });
})



//fetch user by id
app.get("/user/:id", (req, res) => {
    console.log("API to fetch user by id-:", req.params.id);
    let qrid = req.params.id;
    let qr = `SELECT * FROM user WHERE id = ${qrid}`
    db.query(qr, (err, results) => {
        if (err) {
            console.log("Error", err)
        }
        if (results.length > 0) {
            res.send({
                message: "Users data from a ID",
                data: results
            })
        }
    })
})

//delete
app.delete("/user/:id", (req, res) => {
    console.log("API to delete user by id-:", req.params.id);
    let qrid = req.params.id;
    let qr = `DELETE FROM user WHERE id=${qrid};`
    db.query(qr, (err, results) => {
        if (err) {
            console.log("Error", err)
        }
        else {
            res.send({
                message: "Users deleted from a ID",
            })
        }
    })
})



//create data in db 
app.post("/user", (req, res) => {
    console.log(req.body, "Post api to create user");
    let id = req.body.id;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let netImg = req.body.netImg;

    let qr = `insert into user(id,name,email,password,netImg)value('${id}','${name}','${email}','${password}','${netImg}')`;
    db.query(qr, (err, results) => {
        if (err) {
            console.log("Error", err)
        }
        res.send({
            message: "New Data pushed into DB"
        });

    })
})
//auth
app.post('/auth', (request, res) => {
    let email = request.body.email;
    let password = request.body.password;
    console.log("email in api-:", email)
    console.log("password in api-:", password)
    if (email && password) {
        let qr = `SELECT * FROM user WHERE email = '${email}' AND password = '${password}';`;
        db.query(qr, (err,results) => {
            if(results.length > 0){
                res.send({
                    message: "Logged in",
                });
            }
            else{
                res.send({message: "Error"})
            }

          
        })
    }
});