const express = require('express');
const router = express.Router();
const mysql = require('mysql');
var authenticate = require('../../authenticate');

const db = require('./db');


router.get('/', authenticate.verifyToken,authenticate.verifyRoles('cook','manager','waiter'),(req, res)=>{
    let sql = `SELECT * FROM supplier`;
    let query = db.query(sql, (err, result)=> {
        if(err){
            throw err;
        }
        else{
            res.status(200).json({
                data: result,
                message: 'Data Retrieved Successfully!'
            });
        }

    })
});

router.post('/', (req, res) => {
    console.log(req.body);
    let data = req.body
    let sql = 'INSERT INTO supplier SET ?';
    let query = db.query(sql, data,  (err,result) => {
        if(err){
            throw err;
        }
        console.log(result);
        res.status(200).json({
            data: true,
            message: "Supplier Inserted"
        });
    });
});

router.put('/',(req,res) => {

    let id = req.body.id;
    let column_values = req.body;
    
    delete column_values['id'];
    let sql = "UPDATE supplier SET ? WHERE id = ?"

    console.log(id);
    db.query(sql,[column_values, id], (err, result) => {
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
    });

});


router.delete('/', (req, res)=> {
    let sql = "DELETE FROM supplier WHERE id = ?"
    db.query(sql, req.body.id, (err, result) => {
        if(err){
            res.status(404).json({
                data: false,
                message: err
            });
        }
        else {
            res.status(200).json({
                data: true,
                message: result
            });
        }
    });
});
module.exports = router;