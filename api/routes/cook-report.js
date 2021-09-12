const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const authenticate = require('../../authenticate');
const db = require('./db');

router.get('/', (req, res)=>{
    let sql = 
    
    `SELECT C.id, C.NAME as 'Name' FROM EMPLOYEE C, ORDER_CUSTOMER O 
        WHERE C.id = O.cook_id AND C.category_id = (SELECT id 
        FROM CATEGORY WHERE ROLE LIKE '%cook%' OR ROLE LIKE '%COOK%') GROUP BY C.id`;

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
router.get('/:waiter_id', (req, res)=>{

    let sql = 
    `SELECT o.id, c.name as Customer, w.name as Waiter, 
    co.name as Cook, total_amount as 'Total Amount', 
    DATE_FORMAT(order_time,\'%Y-%m-%d\') as Date FROM order_customer o, 
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

router.get('/cook-history/:cookid',authenticate.verifyToken,authenticate.verifyRoles('manager','cook'),(req,res)=>{
    let sql = `SELECT order_customer.id as Order_id, DATE_FORMAT(order_customer.order_time,'%d %b %Y %T') as Order_at, employee.name as Served_by, order_customer.order_status as Status from order_customer,employee,category WHERE employee.id = order_customer.waiter_id AND employee.category_id = category.id AND category.id IN (SELECT id FROM CATEGORY WHERE ROLE LIKE '%waiter%' OR ROLE LIKE '%WAITER%') AND order_customer.cook_id = ? order by order_customer.order_time`;
    db.query(sql, req.params.cookid, (err, result)=> {
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





})


//report of a particular waiter within a particular period.
router.get('/:cook_id/:start_date/:end_date', (req, res)=>{

    let sql = 
    `SELECT o.id, c.name as Customer, co.name as Cook,
        w.name as Waiter, total_amount as 'Total Amount', 
        DATE_FORMAT(order_time,\'%d-%m-%Y\') as Date
        FROM order_customer o, customer c, employee w, 
        employee co WHERE co.id = ? AND o.customer_id = c.id
        AND o.cook_id = co.id AND o.waiter_id = w.id 
        AND DATE_FORMAT(order_time,\'%Y-%m-%d\') 
        BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)`;

    let query = db.query(sql, [req.params.cook_id, req.params.start_date, req.params.end_date], (err, result)=> {
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
