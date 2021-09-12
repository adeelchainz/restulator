const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const authenticate = require('../../authenticate');

const db = require('./db');

router.use(bodyParser.urlencoded({extended:true}));

const storage = multer.diskStorage({
    destination: function(req, file,cb) {
        cb(null,'./uploads');

    },
    filename: function(req,file,cb) {
        cb(null,file.originalname); 
    }



});

const upload = multer({storage: storage});
router.get('/',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter','cook'),(req,res)=>{
    let sql = "SELECT * FROM item_inventory";
    db.query(sql,(err,result)=>{
        if(err){
            res.status(500).json({
                status: false,
                data: err
        
            });            
        }
        else{
            res.status(200).json({
                status:true,
                data : result,
                message:"Items from item_inventory"
    
            });

        }




    });




});

router.post('/',upload.single('image'),authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{
    console.log(req.file);
    console.log("Post Item");
    let column_values = {
        id:'',quantity:req.body.quantity,
        unit:req.body.unit,
        name:req.body.name,
        description:req.body.description,
        image: req.file.path,
        category_id:req.body.category_id
    };
    console.log(column_values);
    
    let sql = `INSERT INTO item_inventory SET ?`;
    db.query( sql,column_values, (err, result)=>{
        if(err){
            res.status(500).json({
                status: false,
                data: err

            });            
        }
        else{
            res.status(200).json({
                status:true,
                data:'Item Inserted in Inventory',
                message:'Item Inserted in Inventory'
            });

        }

        
    });
    
});

router.get('/:id',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter','cook'),(req,res)=>{
    let categ_obj = req.params.id;
    // console.log("Selecting on" + categ_obj);
    let sql = `SELECT * FROM item_inventory WHERE item_inventory.category_id = ${categ_obj}`;
    db.query(sql,(err,result)=>{
        if(err){
            res.status(500).json({
                status: false,
                data: err

            });              
        }
        else{
            res.status(200).json({
                status:true,
                data:result,
                message:"Get item by id"
            });
        }
        


    });


});

router.delete('/:id',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=> {
    let sql = `Delete From item_inventory WHERE id = ?`;
    db.query(sql,[req.params.id],(err,result)=>{
        if(err){
            res.status(500).json({
                status: false,
                data: err

            });            
        }
        else{
            res.status(200).json({
                status:true,
                data: "Item Deleted",
                message:"Item Deleted"
            });

        }

        


    });    
});




module.exports = router;