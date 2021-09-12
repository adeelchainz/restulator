const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const router = express.Router();

const db = require('./db');

router.use(bodyParser.urlencoded({extended:true}));

router.get('/',(req,res)=>{
let sql = "SELECT * FROM supplier";
db.query(sql,(err,result)=>{
    if(err) throw err;
    res.json({
        data:result,
        message: "All suppliers result "
    });



});


});






module.exports = router;
