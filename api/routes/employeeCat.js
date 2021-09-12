const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mysql = require('mysql');
const router = express.Router();
const authenticate = require('../../authenticate');


const db = require('./db');

router.use(bodyParser.urlencoded({extended:true}));

router.get('/getCook/name', (req,res,next) => {
    let sql = `SELECT e.id,e.name,c.id as "cook_id" from employee e, category c where e.category_id = c.id and c.role = "cook"`;
    db.query(sql, (err,result) => {
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

router.get('/getWaiter/', (req,res,next) => {

    let sql = `SELECT e.id,e.name,c.id as "waiter_id" from employee e, category c where e.category_id = c.id and c.role = "waiter"`;

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

router.post('/', (req,res) => {
    let sql = `INSERT into category SET ?`;
    db.query(sql,[req.body], (err,result) => {
        if(err) {
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