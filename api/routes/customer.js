const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const router = express.Router();
var config = require('../../config');
const db = require('./db');
var jwt = require('jsonwebtoken');

var JSAlert = require("js-alert");
var bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');

//create connection
var tokenTime = 8;

function sendEmail(receiver, password,customerName){
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
        html: `<h1>We Welcome You to our Restaurant!</h1><p>Dear ${customerName}, Your account has been successfully created, get your <b>Restulator Security Key</b> Your key: ${password}</p>`
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


router.get('/', (req,res) => {

    let sql = `SELECT id,name, IFNULL(email ,"Not Provided") as email, points from customer`;

    db.query(sql, (err, result) => {
        if(err) {
            res.status(500).json({
                status: false,
                data: err
            });
        }
        else {
            res.status(200).json({
                status: true,
                data: result
            });
        }
    })

});
router.get('/:id', (req,res) => {

    let sql = `SELECT id,name, IFNULL(email ,"Not Provided") as email, points from customer where id = ?`;

    db.query(sql,req.params.id, (err, result) => {
        if(err) {
            res.status(500).json({
                status: false,
                data: err
            });
        }
        else {
            res.status(200).json({
                status: true,
                data: result

            });
        }
    })

});

router.get('/dishes/:orderId',(req,res)=>{
    let sql = `SELECT dish.id, dish.name as DishName, order_dishes.dish_quantity as Quantity,
     dish.price as Price from order_customer INNER JOIN order_dishes ON order_customer.id = order_dishes.order_id 
     INNER JOIN dish ON order_dishes.dish_id = dish.id where order_customer.id =  ?`;

    db.query(sql,req.params.orderId, (err, result) => {
        if(err) {
            res.status(500).json({
                status: false,
                data: err
            });
        }
        else {
            res.status(200).json({
                status: true,
                data: result

            });
        }
    })    
});


router.get('/orders/:id',(req,res)=>{
    let sql = `SELECT order_customer.id,DATE_FORMAT(order_customer.order_time, '%Y-%m-%dT%TZ') as OrderAt,order_customer.bill as Bill,order_customer.payment_status as Payment_Status FROM order_customer where order_customer.customer_id = ?`;

    db.query(sql,req.params.id, (err, result) => {
        if(err) {
            res.status(500).json({
                status: false,
                data: err
            });
        }
        else {
            res.status(200).json({
                status: true,
                data: result

            });
        }
    })    
});

router.post('/login',(req,res) => {
    let status = false;
    // console.log(req.body);
    let data = req.body

    let sql = `SELECT id as customerId,password FROM customer WHERE email = ? `;
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
                        "id": result[0].customerId,
                        "email" : data.email
                    }
                    var token = jwt.sign(token_payload_obj,config.secretKey,{ expiresIn: String(tokenTime)+'h'});
                    var now = new Date();
                    // now.setTime(now.getTime() + 1 * 3600 * 1000);
                    res.cookie('customer-token', token);
                    var customerDataObj = {
                        "id": result[0].customerId,
                        "email" : data.email,
                        "token": token

                    }
                    res.status(200).json({
                        data: [customerDataObj],
                        message:"Auth Successful",
                        status:true
                    });
                    // console.log("Logged In");

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


// var urlencodeParser = bodyParser.urlencoded( {extended:true});
router.post('/', (req,res)=>{

    var genPasswd = false;
    if(req.body.email) {
        genPasswd = true;
        temp_password = Math.random().toString(36).slice(-8);
    }
    // console.log(req.body.password);

    bcrypt.hash(temp_password, 10, function(err, hash){
        if(err) console.log(err);
        JSAlert.alert(temp_password);
        req.body.password = hash;

        let sql = `INSERT INTO customer SET ?`;

        db.query( sql, req.body, (err, result)=>{
            if(err) {
                res.status(500).json({
                    status: false,
                    data: [],
                    message: err.sqlMessage
                });
            }
            // send email if provided.
            else {
            msg = "Customer Added Successfully!";
            if(genPasswd) {
                sendEmail(req.body.email, temp_password, req.body.name);
                msg += " An email has been sent to "+req.body.email+" with Restulator Key";
            }
            
            res.status(200).json({
                status: true,
                data: [result],
                message: msg
            });
        }
            
        });


    });



});



router.put('/',(req,res) => {

    let id = req.body.id;
    let column_values = req.body;
    delete column_values['id'];

    var emailAdded = false;
    if (column_values.email){

        db.query(`SELECT IFNULL(email ,"NA") as email FROM CUSTOMER WHERE id = ?`, id, (err, result) => {

            if (result[0].email == "NA" || result[0].email != column_values.email) emailAdded = true;

        });
    }
    else column_values.email = null;

    let sql = "UPDATE CUSTOMER SET ? WHERE id = ?"

    db.query(sql,[column_values, id], (err, result) => {
        if(err) {
            res.status(500).json({
                status: false,
                data: err
            });
        }
        else {

            // send email if added.
            if (emailAdded) sendEmail(column_values.email, 'Customer');

            res.status(200).json({
                status: true,
                data: result
            });
        }
    });

});


router.delete('/', (req, res)=> {

    let sql = "DELETE FROM CUSTOMER WHERE id = ?"
    db.query(sql, req.body.id, (err, result) => {
        if(err){
            res.status(500).json({
                status: false,
                data: err
            });
        }
        else {
            res.status(200).json({
                status: true,
                data: result
            });
        }
    });
});

module.exports = router;




