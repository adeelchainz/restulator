const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const router = express.Router();
const authenticate = require('../../authenticate');
const db = require('./db');

router.use(bodyParser.urlencoded({extended:true}));

router.get('/',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter'),(req,res)=>{
    let sql = `SELECT item_category.id, item_category.name, COUNT(item_inventory.id) as items_count FROM item_inventory,item_category WHERE item_inventory.category_id = item_category.id GROUP BY item_category.name ORDER BY item_category.id ASC`;
    db.query(sql,(err,result)=>{
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
                message: "Item count by category route"
                
                
                }); 
        }
       


    });

});
module.exports = router;