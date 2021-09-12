const express = require('express');
const router = express.Router();
const mysql = require('mysql');
var bcrypt = require('bcrypt');

const db = require('./db');




// get info of all current live orders of current waiter.

router.get('/:waiter_id', (req, res)=>{

    //var array_of_order_id = req.body.id;     Incase we want to send array of order_id.

    let sql = 

    `SELECT oc.id, DATE_FORMAT(oc.order_time, '%Y-%m-%dT%TZ') 
        AS order_time, GROUP_CONCAT(dish.name SEPARATOR ',') 
        AS dishes,GROUP_CONCAT(dishes.dish_quantity SEPARATOR ',') 
        AS dishes_quantity, DATE_FORMAT(oc.complete_time, '%Y-%m-%dT%TZ') 
        AS complete_time, table_number, waiter.name AS waiter, 
        cook.name AS cook,oc.order_status as status FROM order_customer oc, employee cook, 
        employee waiter, order_dishes dishes, dish dish WHERE 
        oc.id in ( SELECT order_id FROM live_orders) AND 
        oc.id = dishes.order_id AND cook.id = oc.cook_id AND 
        waiter.id = ? AND waiter.id = oc.waiter_id AND dish.id = dishes.dish_id AND 
        oc.order_status NOT IN ('served') GROUP BY oc.id ORDER BY oc.complete_time asc`;

    let query = db.query(sql, req.params.waiter_id , (err, result)=> {
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
    })
});




// get info of a partcular order.

router.get('/:waiter_id/:id', (req, res) => {

    console.log(req.params);
    let sql = 

    `SELECT oc.id, DATE_FORMAT(oc.order_time, '%Y-%m-%dT%TZ') 
        AS order_time, GROUP_CONCAT(dish.name SEPARATOR ',') 
        AS dishes, GROUP_CONCAT(dishes.dish_quantity SEPARATOR ',') 
        AS dishes_quantity, DATE_FORMAT(oc.complete_time, '%Y-%m-%dT%TZ') 
        AS complete_time, table_number, waiter.name AS waiter, 
        cook.name AS cook,oc.order_status as status FROM order_customer oc, employee cook, 
        employee waiter, order_dishes dishes, dish dish WHERE 
        oc.id in ( SELECT order_id FROM live_orders WHERE  order_id = ?) AND 
        oc.id = dishes.order_id AND cook.id = oc.cook_id AND 
        waiter_id = ? AND oc.order_status NOT IN ('served') AND
        waiter.id = oc.waiter_id AND dish.id = dishes.dish_id
        GROUP BY oc.id`;

    let query = db.query(sql, [req.params.id, req.params.waiter_id], (err, result)=> {

        if(err){
            res.status(500).json({
                status: false,
                data: err

            });
        }
        else {            
            res.status(200).json({
                status: true,
                data: result[0]   // no need to use array notation on the front-end.
            });
        }
    })
});


// mark order as cooked, remove from live-kitchen.

router.delete('/', (req, res)=> {

    db.beginTransaction(function(err){
        if(err){
            res.status(500).json({
                staus: false,
                data: err
            });
        }
        else {
            let sql = "DELETE FROM LIVE_ORDERS WHERE order_id = ?"
            db.query(sql, req.body.id, (err, result) => {
                if(err){
                    db.rollback(function() {
                        res.status(500).json({
                            status: false,
                            data: err
                        });
                    });
                }
                else {
                    let update = "UPDATE ORDER_CUSTOMER SET order_status = 'served' WHERE id = ?"
                    db.query(update, req.body.id, (err, result) => {
                        if(err){
                            db.rollback(function() {
                                res.status(500).json({
                                    status: false,
                                    data: err
                                });
                            });
                        }
                        else {
                            db.commit(function(err) {
                                if (err) { 
                                  db.rollback(function() {
                                    res.status(500).json({
                                        status: false,
                                        data: err
                                    });
                                  });
                                }
                                else {
                                    res.status(200).json({
                                        status: true
                                    });
                                }         
                            });  
                        }
                    });
                }
            });
        }
    });
    
});

module.exports = router;