const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const router = express.Router();
const authenticate = require('../../authenticate');
const db = require('./db');

router.use(bodyParser.urlencoded({extended:true}));



router.get('/',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter','cook'),(req,res)=>{
    let sql = `SELECT * from item_category`;
    let query = db.query(sql,(err,result) => {
        if(err) {
            res.status(500).json({
                status: false,
                data: err
        
            });             
        }
        else{
            res.status(200).json({
                status:true,
                data:result,
                message: "Item categories"
                }); 


        }

    });
});

router.post('/',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{
    let sql = `INSERT into item_category SET ?`;
    db.query(sql,req.body,(err,result)=>{
        if(err) {
            res.status(500).json({
                status: false,
                data: err
            });            
        }
        else{
            res.status(200).json({
                status:true,
                data: 'Item Category Added',
                message: "Item Category Added"
            }); 
        }
              


    });

});



module.exports = router;