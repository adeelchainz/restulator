const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var fs = require('fs');
var JSAlert = require("js-alert");
const router = express.Router();

const db = require('./db');

router.use(bodyParser.urlencoded({extended:true}));


router.post('/', (req,res) => {
    var userData = [
        req.body.email,
        req.body.password,
        24   // needs to be fixed
    ]
    user = userData;
    console.log(req.body);

    bcrypt.hash(user[1], 10, function(err, hash){
        if(err) console.log(err);
        user[1] = hash;  // hashing the password
        JSAlert.alert(user[1]); 
        sql = "INSERT INTO user (email, password, emp_id) VALUES ?"

        db.query(sql, [[user]], function(err){ //saves non-hashed password
        if(err) console.log(err);
        console.log("successfull");
        res.status(200).json({
            message:'True'
    
        });
    });

});

});





module.exports = router;