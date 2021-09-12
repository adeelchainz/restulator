const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mysql = require('mysql');
const router = express.Router();
const authenticate = require('../../authenticate');


// create connection

const db = require('./db');
router.use(bodyParser.urlencoded({extended:true}));


router.get('/',(req, res, next) => {
    let sql = `SELECT * from dish_type`;
    db.query(sql, (err,results) => {
        if(err){
            res.status(500).json({
                status: false,
                data: err
            });
        }
        else {
            res.status(200).json({
                data: results,
                status: true
            });
        }
    });
});

router.post('/',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter') ,(req,res) => {
    let sql = `INSERT into dish_type SET ?`;
    db.query(sql,req.body, (err,result) => {

        if(err){
            res.status(500).json({
                status: false,
                data: err
            });
        }
        else {
            res.status(200).json({
                data: result,
                status: true

            });
        }
    });
});

module.exports = router;