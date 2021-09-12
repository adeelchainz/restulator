const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const router = express.Router();
const multer = require('multer');
const authenticate = require('../../authenticate');
const db = require('./db');

router.use(bodyParser.urlencoded({extended:true}));

router.get('/orderCount',authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter') ,(req,res) => {
    let sql = `SELECT COUNT(*) as "total_orders" FROM order_customer`;

    db.query(sql, (err,result) => {
        if(err) {
            res.status(500).json({
                status: false,
                data: err
            });
        }
        res.status(200).json({
            status: true,
            data: result
        });
    });
});

router.get('/orders/pendingOrders', authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter') ,(req,res) => {
    let sql = `SELECT count(*) as "pending_orders" from order_customer where order_status = "pending" `;

    db.query(sql, (err,result) => {
        if(err) {
            res.status(500).json({
                status: false,
                data: err
            });
        }
        res.status(200).json({
            status: true,
            data: result
        });
    });
});

router.get('/get/today/orders',authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter') , (req,res) => {

    let sql = `SELECT count(*) as "orders_today" from order_customer WHERE DATE(order_time) = curdate()`;

    db.query(sql, (err,result) => {
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

router.get('/orders/get/serving/orders',authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter'), (req,res) => {
    let sql = `SELECT COUNT(*) as "serving_orders" from order_customer where order_status = "served"`;

    db.query(sql, (err,result) => {
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