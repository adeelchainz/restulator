const express = require('express');
let cookieParser = require('cookie-parser'); 

const router = express.Router();
const mysql = require('mysql');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var JSAlert = require("js-alert");
var config = require('../../config');
var authenticate = require('../../authenticate');

var tokenTime = 8;
const  db = require('./db');

// router.use(cookieParser);
function sendEmail(receiver, password ,customerName){
    // password = Math.random().toString(36).slice(-8);

    var transport = nodemailer.createTransport({
        service: 'gmail',
        port: 2525,


        // Insert Email and password to send Email.
        auth: {
          user: 'restulator.app@gmail.com',
          pass: 'restulator123'
        }
        // Insert Email and password to send Email.


      });
    const message = {
        from: 'restulator.app@gmail.com', 
        to: receiver,        
        subject: 'WELCOME TO RESTULATOR',
        html: `<h1>Password Updated!</h1><p>Dear ${customerName}, Your password has been successfully generated, your updated <b>Restulator Password: </b>${password}</p>`
    };
    transport.sendMail(message, function(err, info) {
        if (err) {
          return false;
        } 
        else {
          return true;
        }
    });
}


router.get('/', (req, res)=>{
    let sql = `SELECT * FROM USER`;
    let query = db.query(sql, (err, result)=> {
        if(err){
            throw err;
        }
        res.send(result);
    })
});
router.get('/token-time',(req,res)=>{
    if(err){
        res.status(500).json({
        status: false,
        data: err
     
    });
    }
    else{
        res.status(200).json({
            status:true,
            data: tokenTime,
            message: 'Token time Retrieved Successfully!'
        });

    }
});

router.post('/signup', (req,res) => {
    var userData = [
        req.body.email,
        req.body.password,
        req.body.emp_id
    ]
    user = userData;
    console.log(req.body);

    bcrypt.hash(user[1], 10, function(err, hash){
        if(err) console.log(err);
        user[1] = hash;  // hashing the password
        JSAlert.alert(user[1]); 
        sql = "INSERT INTO user (email, password, emp_id) VALUES ?"

        db.query(sql, [[user]], function(err){ //saves non-hashed password
        
        if(err) {
            res.status(404).json({
                message: 'Error occured while registration',
                data: err,
                status: true
            })
        }

        else {
            res.status(200).json({
                message:'Registration Successfull',
                status: true
    
            });
        }
    });

});

});


router.post('/', (req, res) => {
    let status = false;
    // console.log(req.body);
    let data = req.body

    let sql = 
    `SELECT employee.id as emp_id,employee.name ,user.password, 
    category.role FROM user, employee,category WHERE user.emp_id = employee.id 
    and employee.category_id=category.id AND email = ? `;

    let query = db.query(sql, data.email,  (err,result) => {
        if(err){
            res.status(404).json({
                data: false,
                message: "Server side query error\n" + err
            });
        }
        if(result.length > 0) {
            bcrypt.compare(data.password, result[0].password, function(err, ress) {
                if(!ress){
                    res.json({
                        // data: false,               
                        message:"Email and password does not match",
                        status:false
                    });
                    
                }
                else { 
                    var token_payload_obj = {
                        "id": result[0].emp_id,                        
                        "email" : data.email,
                        "role" : result[0].role

                    }
                    var token = jwt.sign(token_payload_obj,config.secretKey,{ expiresIn: String(tokenTime)+'h'});
                    var now = new Date();
                    // now.setTime(now.getTime() + 1 * 3600 * 1000);
                    res.cookie('token', token);
                    var userDataObj = {
                        "id": result[0].emp_id,
                        "email" : data.email,
                        "name" : result[0].name,                        
                        "role" : result[0].role,
                        "token": token

                    }
                                        
                    // res.cookie("token_id", token);
                    // res.setHeader('authorization', 'Bearer '+ token)
                    console.log("Id : "+ userDataObj.id);                   
                    res.status(200).json({
                        data: [userDataObj],
                        message:"Auth Successful",
                        status:true
                        // token: token
                    });
                    console.log("Logged In");

                }
            });
        }
        else {
            res.json({
                // data: false,               
                message:"Email doesn't exist.",
                status:false
            });
        }
        
    });
});

router.get('/employee/', (req,res) => {
   
    let sql = `SELECT  DISTINCT(e.id),e.name FROM  employee e 
    WHERE e.id NOT IN (SELECT u.emp_id FROM user u)`;

    db.query(sql, (err,result) => {
        if(err) {
            res.status(404).json({
                message: 'Error retrieving the employees',
                data: false
            });
        }
        else {
            res.status(200).json({
                message: 'Employees retrieved',
                data: result
            });
        }
    });
});


router.put('/change-password', (req, res)=>{

    let email = req.body.email;
    let password = Math.random().toString(36).slice(-8);


    bcrypt.hash(password, 10, function(err, hash){
        if(err) console.log(err);
        password = hash;  // hashing the password
        sql = `UPDATE user SET password = ? WHERE email = ?`;
        console.log("generated password: " + password);

        db.query(sql, [password, email], (err, result) => {
            if(err){
                res.status(500).json({
                    message: err.sqlMessage,
                    status: false
                });
            }
            else {
                res.status(200).json({
                    message: 'Users List',
                    status: true,
                    data: result
                });

                sendEmail(email, password, 'Employee');
            }
        });
    });


});



module.exports = router;