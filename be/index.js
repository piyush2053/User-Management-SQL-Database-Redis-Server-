const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const redis = require('redis');
const client = redis.createClient();

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
//checking connection with Database
db.connect(err => {
    if (err) {
        console.log("404 - Error Connecting to Database")
    } else {
        console.log("Database Connection Successful !")
    }
})

//redis implementation for Fetching User only 
const redis_getUsers = (req, res, next) => {
    console.log("Inside redis...................")
    client.get('getUsers', (err, redis_data) => {
        console.log("INside redis get request...................")
        if (err) {
            console.log("Error in Redis Client while Fetching data from Redis Key", err);
        } else if (redis_data) {
            console.log("Fetching from Redis Not from Databse")
            res.send({
                data: JSON.object(redis_data),//Firse Data to STring se Object me convert kara JSON.parse,  
                message: "Fetched User from Redis"
            })
        } else {
            next();
        }

    })
}

//get user data from DB
app.get("/users", redis_getUsers, (req, res) => {
    console.log("Api running to fetch users from Database only (Query SQL)");
    let qrr = `SELECT * FROM user order by id;`;
    db.query(qrr, (err, results) => {
        if (err) {
            console.log("Error", err);
        } else {
            //Setting Redis key like-:  setEx( REDIS_KEY , EXPIRE_TIME , VALUE (ONly string type hona chahiye) )
            client.setex('getUsers', 3000, JSON.stringify(results))
            res.send({
                message: "Records fetched from DB",
                data: results
            });
        }

    });
})




//name and image by email
app.get("/name/:email", (req, res) => {
    let email = req.params.email;
    console.log("Api running to fetch name by email");
    let qrr = `SELECT name,netImg FROM user WHERE email ='${email}';`;
    db.query(qrr, (err, results) => {
        if (results.length > 0) {
            res.send({
                data: results[0].name,
                body: results[0].netImg
            });
        }
        else {
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
            client.del('getUsers')
        }
    })
})
//create data in db 
app.post("/user", (req, res) => {
    console.log("Post api to create user");
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let netImg = req.body.netImg;
    let qr = `insert into user (name,email,password,netImg) value ("${name}","${email}","${password}","${netImg}");`;
    //Pushing the new user into Database
    let qrr = `select * from user where password = '${password}';`;
    db.query(qr, (err) => {
        if (err) {
            console.log("Error", err)
        }
        res.send({
            message: "Created in DB"
        });

    })
    function getDataToPushInRedis() {
        db.query(qrr, (err, results) => {
            if (err) {
                console.log(err, "Error...............")
            }
            let resultToPush = JSON.stringify(results)
            client.append('getUsers',resultToPush); //      Pushing the new user into Redis as well                       

        })
    }
    getDataToPushInRedis()
})



//auth
app.post('/auth', (request, res) => {
    let email = request.body.email;
    let password = request.body.password;
    console.log("email in api-:", email)
    console.log("password in api-:", password)
    if (email && password) {
        let qr = `SELECT * FROM user WHERE email = '${email}' AND password = '${password}';`;
        db.query(qr, (err, results) => {
            if (results.length > 0) {
                res.send({
                    message: "Logged in",
                });
            }
            else {
                res.send({ message: "Error" })
            }


        })
    }
});