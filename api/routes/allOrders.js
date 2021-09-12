const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const router = express.Router();
const authenticate = require('../../authenticate');
const db = require('./db');


router.use(bodyParser.urlencoded({extended:true}));

router.get('/', (req,res) => {
    let sql = `SELECT e_cook.name as "cook_name", e_waiter.name as "waiter_name",c.name as "customer_name" ,oc.id,DATE_FORMAT(oc.order_time,'%Y-%m-%dT%TZ') as "order_time", DATE_FORMAT(oc.complete_time,'%Y-%m-%dT%TZ') as "complete_time", oc.bill, oc.payment_status from order_customer oc, employee e_cook,employee e_waiter, customer c where c.id = oc.customer_id and oc.cook_id = e_cook.id and oc.waiter_id = e_waiter.id and e_cook.id in (SELECT e.id  from employee e, category c where e.category_id = c.id and c.role = "cook") and e_waiter.id in (SELECT e.id  from employee e,category c where e.category_id = c.id and c.role = "waiter") ORDER BY oc.order_time desc`;
    db.query(sql, (err, result) => { 
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

router.delete('/:id',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter'),(req,res) => {
    let sql = `DELETE from order_customer where id = ?`;

    db.query(sql,req.params.id, (err, result) => {
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