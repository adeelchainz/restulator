const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const db = require('./db');


router.get('/', (req, res)=>{
    let sql = 
    
    `SELECT E.id, E.NAME as 'Name' FROM EMPLOYEE E, ORDER_CUSTOMER O 
        WHERE E.id = O.waiter_id AND E.category_id = (SELECT id 
        FROM CATEGORY WHERE ROLE LIKE '%waiter%' OR ROLE LIKE '%WAITER%') GROUP BY E.id`;

    db.query(sql, (err, result)=> {
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



//report of a particular waiter.
// for my-orders.
router.get('/:waiter_id', (req, res)=>{

    let sql = 
    `SELECT o.id as order_id, c.name as Customer,
    co.name as Cook, total_amount as 'Total Amount', 
    o.order_time as 'Order Time', 
    o.order_status as 'Order Status', o.payment_status
    as 'Payment Status'
    FROM order_customer o, 
    customer c, employee w, employee co WHERE 
    w.id = ? AND o.customer_id = c.id AND 
    o.waiter_id = w.id AND o.cook_id = co.id`;

    let query = db.query(sql, req.params.waiter_id, (err, result)=> {
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
router.get('/:waiter_id/:start_date/:end_date', (req, res)=>{
    let sql = 
    `SELECT o.id, c.name as Customer, w.name as Waiter, 
        co.name as Cook, total_amount as 'Total Amount', 
        DATE_FORMAT(order_time,\'%d-%m-%Y\') as Date FROM order_customer o, 
        customer c, employee w, employee co WHERE 
        w.id = ? AND o.customer_id = c.id AND 
        o.waiter_id = w.id AND o.cook_id = co.id 
        AND DATE_FORMAT(order_time,\'%Y-%m-%d\') 
        BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)`;

    let query = db.query(sql, [req.params.waiter_id, req.params.start_date, req.params.end_date], (err, result)=> {
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
    console.log(query.sql);
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
