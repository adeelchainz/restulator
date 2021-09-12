const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const router = express.Router();
const multer = require('multer');
const authenticate = require('../../authenticate');

const db = require('./db');

router.use(bodyParser.urlencoded({extended:true}));

router.get('/today-purses-total',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{
    let sql = "SELECT sum(bill) as total_supplies FROM supply_info WHERE DATE(supply_at) = curdate()";
    db.query(sql,(err,result)=>{
        if(err){
            res.status(404).json({
                status: false,
                data: err

            });            
        }
        res.status(200).json({
            data : result,
            message:"Sum of all purses today"

        });


    });
});

router.get('/today-total-orders',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{

    let sql = `SELECT count(*) as "orders_today" from order_customer WHERE DATE(order_time) = curdate()`;

    db.query(sql, (err,result) => {
        if(err) {
            res.status(404).json({
                message: "Error retrieving the total orders for today",
                data: false

            });
        }
        else {
            res.status(200).json({
                message: "Count Today's order retrieved!",
                data: result
            });
        }
    });    
});
router.get('/today-total-sell',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{

    let sql = `SELECT sum(total_amount) as total_sell FROM order_customer WHERE DATE(order_time) = curdate()`;

    db.query(sql, (err,result) => {
        if(err) {
            res.status(404).json({
                message: "Error retrieving the total sales for today",
                data: false

            });
        }
        else {
            res.status(200).json({
                message: "Sum of Today order's total amount retrieved!",
                data: result
            });
        }
    });    
});

router.get('/dish-sells-today',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{

    let sql = `SELECT dish.name Dish_Name, count(*) as Total_Order FROM order_dishes, dish , order_customer WHERE order_dishes.dish_id = dish.id AND order_customer.id = order_dishes.order_id AND DATE(order_customer.order_time) = curdate() GROUP BY order_dishes.dish_id`;

    db.query(sql, (err,result) => {
        if(err) {
            res.status(404).json({
                message: "Error retrieving the dish sells for today",
                data: false

            });
        }
        else {
            res.status(200).json({
                message: "Dish sells with order count retrieved!",
                data: result
            });
        }
    }); 

});

router.get('/waiter-orders-today',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{

    let sql = `SELECT E.NAME as 'Waiter_Name', COUNT(*) as 'Total_Orders' FROM EMPLOYEE E, ORDER_CUSTOMER O WHERE E.id = O.waiter_id AND DATE(O.order_time) = curdate() AND E.category_id = (SELECT id FROM CATEGORY WHERE ROLE LIKE '%waiter%' OR ROLE LIKE '%WAITER%') GROUP BY E.id`
    db.query(sql, (err,result) => {
        if(err) {
            res.status(404).json({
                message: "Error retrieving the waiter total orders for today",
                data: false

            });
        }
        else {
            res.status(200).json({
                message: "Waiter orders with order count retrieved!",
                data: result
            });
        }
    }); 

});

router.get('/cook-orders-today',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{

    let sql = `SELECT E.NAME as 'Cook_Name', COUNT(*) as 'Total_Orders' FROM EMPLOYEE E, ORDER_CUSTOMER O WHERE E.id = O.cook_id AND DATE(O.order_time) = curdate() AND E.category_id = (SELECT id FROM CATEGORY WHERE ROLE LIKE '%cook%' OR ROLE LIKE '%COOK%') GROUP BY E.id`
    db.query(sql, (err,result) => {
        if(err) {
            res.status(404).json({
                message: "Error retrieving the kitchen total orders for today",
                data: false

            });
        }
        else {
            res.status(200).json({
                message: "Kitchen orders with order count retrieved!",
                data: result
            });
        }
    }); 

});

router.put('/tax',authenticate.verifyToken,authenticate.verifyRoles('manager'), (req,res) => {
    let column_value = req.body.tax;
    var tax = column_value / 100;

    let sql = `ALTER TABLE order_customer ALTER tax SET DEFAULT ${tax}`;

    db.query(sql, (err,result) => {
        if(err) {
            res.status(404).json({
                message: 'Error updating the tax',
                data: false
            });
        }
        else {
            res.status(200).json({
                message: 'Tax is updated!',
                data: result
            });
        }
    });
});

router.put('/points',authenticate.verifyToken,authenticate.verifyRoles('manager'), (req,res) => {
    let column_value = req.body.points_per_order;
    var points_per_order = column_value / 100;

    let sql = `ALTER TABLE order_customer ALTER points_per_order SET DEFAULT ${points_per_order}`;

    db.query(sql, (err,result) => {
        if(err) {
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

router.put('/limits',authenticate.verifyToken,authenticate.verifyRoles('manager'), (req,res) => {
    let column_value = req.body.points_limits;

    let sql = `ALTER TABLE order_customer ALTER points_limits SET DEFAULT ${column_value}`;

    db.query(sql, (err,result) => {
        if(err) {
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

router.put('/discount',(req,res) => {
    let column_value = req.body.discount_percent;
    let discount = column_value / 100;

    let sql = `ALTER TABLE order_customer ALTER discount_percent SET DEFAULT ${discount}`;

    db.query(sql, (err,result) => {
        if(err) {
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






module.exports = router;