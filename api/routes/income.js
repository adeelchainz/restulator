const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const db = require('./db');


router.get('/', (req,res) => {
    
    let sql = 
    `SELECT id,DATE_FORMAT(order_time, \'%m/%d/%Y\') as "date", 
        table_number, total_amount, tax, bill, payment from 
        order_customer WHERE payment_status = "paid"`;

    db.query(sql, (err, result) => {
        if(err) {
            res.status(404).json({
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
