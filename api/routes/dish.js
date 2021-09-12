const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mysql = require('mysql');
const router = express.Router();
const authenticate = require('../../authenticate');

const db = require('./db');
router.use(bodyParser.urlencoded({extended:true}));



router.get('/:dishType_id',(req,res) => {
    let sql = "SELECT * FROM dish  WHERE dishType_id = ?";

    db.query(sql,req.params.dishType_id, (err,result) => {
        if(err){
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

router.get('/dishPrice/:dish_id', (req,res,next) => {

    let sql = `SELECT * FROM dish d  WHERE d.id = ?`

    db.query(sql,req.params.dish_id, (err,result) => {
        if(err){
            res.status(500).json({
                status: false,
                data: err,
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

router.post('/', authenticate.verifyToken,authenticate.verifyRoles('manager','waiter') , (req,res) => {

    db.beginTransaction(function(err) {
        if (err) { 
            db.rollback(function() {
                res.status(500).json({
                    status: false,
                    data: err
                });
            });
        }
        var obj = {
            id:'',
            name: req.body.data.name,
            description: req.body.data.description,
            price:req.body.data.price,
            dishType_id:req.body.data.dishType_id
        };
    
      let sql = 'INSERT INTO dish SET ?';
      db.query(sql, obj, function(err, result) {
          if (err) { 
            db.rollback(function() {
                res.status(500).json({
                    status: false,
                    data: err
    
                });
            });
        }
        var dish_id = result.insertId;

        for(var i in req.body.data.ingredients) {

            var ingredientsObj = {
                dish_id: dish_id,
                item_id: req.body.data.ingredients[i][0],
                item_quantity:req.body.data.ingredients[i][1]
            };

            let sql1 = 'INSERT INTO ingredients SET ?';
            db.query(sql1, ingredientsObj, function(err, result1) {
              if (err) { 
                db.rollback(function() {
                    res.status(500).json({
                        status: false,
                        data: err
        
                    });
                });
              }

              db.commit(function(err) {
                if (err) { 
                    db.rollback(function() {
                        res.status(500).json({
                            status: false,
                            data: err
            
                        });
                    });
                }                  
              });   
    
            });
        }
        res.status(200).json({
            status: true,
            data: result
        });

        });

    });
});

router.put('/', authenticate.verifyToken,authenticate.verifyRoles('manager','waiter'),(req,res) => {

    let column_values = {name: req.body.name,description: req.body.description, price:req.body.price, dishType_id: req.body.dishType_id};

    let sql = "UPDATE dish  SET ? WHERE id= ?";

    db.query(sql,[column_values,req.body.id], (err,result) => {
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

router.delete('/:dishId',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter') , (req,res) => {
    let sql = `DELETE from dish where id = ?`;

    db.query(sql, req.params.dishId, (err, result) => {
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

router.get('/getDishes/allDishes',authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter','cook'),(req,res) => {
    let sql = `SELECT d.id,d.name,d.description,d.price,dt.type,dt.type_id from dish d, dish_type dt where d.dishType_id = dt.type_id ORDER BY d.id desc`;

    db.query(sql, (err, result) => {
        if(err){
            res.status(500).json({
                data: err,
                status: false
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