const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mysql = require('mysql');
const router = express.Router();
const authenticate = require('../../authenticate');


const db = require('./db');

router.use(bodyParser.urlencoded({extended:true}));

router.get('/type',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter') , (req, res, next) => {
    let sql = `SELECT * from item_category`;
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

router.get('/:ingType',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter') , (req,res) => {
    let sql = `SELECT id, name from item_inventory where category_id = ?`;
    db.query(sql,req.params.ingType, (err, result) => {
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

router.post('/check/quantity/:dishId', (req,res) => {
    let sql = `SELECT inv.quantity, ing.item_quantity * ? as "required", min(inv.quantity / ing.item_quantity) as "possible" from ingredients ing, item_inventory inv WHERE dish_id = ? AND inv.id = ing.item_id`;

   db.query(sql,[req.body.quantity,req.params.dishId], (err,result) => {
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

router.post('/',authenticate.verifyToken,authenticate.verifyRoles('manager') , (req,res) => {
    let item_quantity = req.body.item_quantity;
    let item_id = req.body.item_id;
    let dish_id = req.body.dish_id;
    let column_value = req.body;

    db.beginTransaction(function(err) {
        if (err) { 
            db.rollback(function() {
                res.status(500).json({
                    status: false,
                    data: err
                });
            });
        }

    let sql1 = `SELECT EXISTS(SELECT * FROM ingredients WHERE dish_id = ?) as "exists"`;

    db.query(sql1, dish_id, (err,result1) => {
        if(err) {
            res.status(500).json({
                status: false,
                data: err
            });
        }
        else {
            if(result1[0].exists == 1) {
    let sql = `SELECT item_id from ingredients where dish_id = ?`;

    db.query(sql,dish_id, (err,result)=> {
        if(err) {
            db.rollback(function() {
                res.status(500).json({
                    status: false,
                    data: err
                });
            });
          }

    var itemId = result[0].item_id;

    if(itemId == item_id) {
        let sql2 = `UPDATE ingredients SET item_quantity = item_quantity + ? where dish_id = ? and item_id = ?`;

        db.query(sql2, [item_quantity, dish_id, item_id], (err,result2) => {
            if(err) {
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
    else {
        let sql3 = `INSERT INTO ingredients SET ?`;
        db.query(sql3, column_value, (err,result3) => {
            if(err) {
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
    });
            }
            else {
                let sql3 = `INSERT INTO ingredients SET ?`;
                db.query(sql3, column_value, (err,result3) => {
                    if(err) {
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
            data: result1
        });
        
    }
 });

    });
});

//ingredients
router.get('/getAllIngredients/:dishId',authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter','cook'), (req,res) => {
    let sql = `SELECT iv.id, iv.name, iv.unit, i.item_quantity, i.dish_id as "dish_id" from item_inventory iv, ingredients i where i.item_id = iv.id and i.dish_id = ?`;

    db.query(sql, req.params.dishId, (err, result) => {
        if(err) {
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
    } );
} );

router.put('/edit', authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter','cook'), (req,res) => {
    let sql = `UPDATE ingredients SET item_quantity = ? where dish_id = ? and item_id = ?`;

    db.query(sql,[req.body.item_quantity, req.body.dish_id, req.body.item_id], (err,result) => {
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

//delete ingredient
router.delete('/:dishId', authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter','cook'), (req, res) => {
    let sql = `DELETE from ingredients where dish_id = ? and item_id = ?`;
    db.query(sql, [req.params.dishId, req.body.item_id], (err,result) => {
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

module.exports = router;