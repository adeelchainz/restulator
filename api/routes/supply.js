const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const db = require('./db');


router.get('/', (req, res)=>{
    let sql = `SELECT id, supplier_id, DATE_FORMAT(SUPPLY_AT, '%Y-%m-%dT%TZ')
                AS supply_at, bill, payment, payment_status FROM SUPPLY_INFO`;
    let query = db.query(sql, (err, result)=> {
        if(err){
            throw err;
        }
        res.status(200).json({
            data: result,
            message: 'Data Retrieved Successfully!'
        });
    })
});


router.post('/', (req, res)=>{
    var id = req.body.id;   //represents supplier_id

    let sql = `SELECT supply_info.id, supplier.name AS supplier_name, DATE_FORMAT(SUPPLY_AT, '%Y-%m-%dT%TZ')
                AS supply_at, bill, payment, payment_status FROM SUPPLY_INFO, SUPPLIER WHERE SUPPLIER_ID = ? AND SUPPLIER.ID = ?`;
    
    let query = db.query(sql, [id, id], (err, result)=> {
        if(err){
            res.status(404).json({
                data: false,
                message: err
            });
        }
        else {
            res.status(200).json({
                data: result,
                message: 'Data Retrieved Successfully!'
            });

        }
        console.log(result);
    })
});

module.exports = router;