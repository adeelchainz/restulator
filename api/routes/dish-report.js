const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const db = require('./db');


router.get('/', (req, res)=>{

    let sql =
        `SELECT d.id, d.name as Name FROM dish d, order_dishes o 
        WHERE d.id = o.dish_id GROUP BY d.id`; 

    let query = db.query(sql, (err, result)=> {
        if(err){
            res.status(200).json({
                status: false,
                data: err
            });
        }
        res.status(200).json({
            status: true,
            data: result
        });
    })
});

//report of a particular waiter.
router.get('/:dish_id', (req, res)=>{

    let sql = 
        `SELECT o.order_id, d.name, d.price, t.type, 
        c.name as Customer, o.dish_quantity as quantity,
        DATE_FORMAT(oc.order_time,\'%Y-%m-%d\') AS Date
        FROM dish d, dish_type t, order_dishes o, 
        order_customer oc, customer c WHERE d.id = o.dish_id 
        AND d.dishType_id = t.type_id AND 
        oc.customer_id = c.id AND oc.id = o.order_id AND d.id = ?`

    let query = db.query(sql, req.params.dish_id, (err, result)=> {
        if(err){
            res.status(200).json({
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


//report of a particular waiter within a particular period.
router.get('/:dish_id/:start_date/:end_date', (req, res)=>{

    let sql = 

        `SELECT o.order_id, d.name as Dish, d.price Price, t.type as Type, 
            c.name as Customer, o.dish_quantity as Quantity,
            DATE_FORMAT(oc.order_time,\'%d-%m-%Y\') AS Date
            FROM dish d, dish_type t, order_dishes o, 
            order_customer oc, customer c WHERE d.id = o.dish_id 
            AND d.dishType_id = t.type_id AND 
            oc.customer_id = c.id AND oc.id = o.order_id AND d.id = ?
            AND DATE_FORMAT(order_time,\'%Y-%m-%d\') 
            BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)`;

    let query = db.query(sql, [req.params.dish_id, req.params.start_date, req.params.end_date], (err, result)=> {
        if(err){
            res.status(200).json({
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






// report of all waiters.
// expects an array of waiter ids.
router.post('/', (req, res)=>{

    var waiter_ids = req.body.id;

    let sql = 
    `SELECT o.id, c.name as Customer, w.name as Waiter, 
    co.name as Cook, total_amount as 'Total Amount', 
    DATE(order_time) as Date FROM order_customer o, 
    customer c, employee w, employee co WHERE 
    w.id in (?) AND o.customer_id = c.id AND 
    o.waiter_id = w.id AND o.cook_id = co.id`;

    let query = db.query(sql, [waiter_ids], (err, result)=> {
        if(err){
            res.status(200).json({
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
module.exports = router;
