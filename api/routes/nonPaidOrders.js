const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const router = express.Router();
const authenticate = require('../../authenticate');

const db = require('./db');

router.use(bodyParser.urlencoded({extended:true}));

router.get('/payment-order/:orderId',authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter'), (req,res) => {
    let sql = `SELECT d.id as "dish_id" ,d.name as "dish_name",d.price,dt.type_id,dt.type, od.dish_quantity,oc.id as "order_id",oc.order_time,oc.bill,oc.total_amount,oc.tax from dish d, dish_type dt,order_dishes od, order_customer oc where d.dishType_id = dt.type_id and od.dish_id = d.id and od.order_id = oc.id and oc.id = ?`;
  
    db.query(sql,req.params.orderId, (err,result) => {
      if(err){
        res.status(500).json({
            status: false,
            data: err,
            message: 'Unsuccessfull'
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

  router.post('/payment-order/payment/:orderId',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter') , (req,res) => {
    var payment = req.body.payment;
    var order_id = req.params.orderId;

    db.beginTransaction(function(err) {
      if (err) { 
        db.rollback(function() {
          res.status(500).json({
            status: false,
            data: err,
            message:"Unsuccessful"

        });
        });
      }
        else {
        let sql = `UPDATE order_customer SET payment = ? where id = ?`;

    db.query(sql,[payment,order_id], (err, result) => {
        if (err) { 
            db.rollback(function() {
              res.status(500).json({
                status: false,
                data: err,
                message:"Unsuccessful"

            });
            });
        }
        else {
            let sql1 = `UPDATE order_customer SET payment_status = "paid" where id = ?`;

            db.query(sql1,order_id, (err, result) => {
                if(err) {
                    db.rollback(function() {
                      res.status(500).json({
                        status: false,
                        data: err,
                        message:"Unsuccessful"
        
                    });
                    });
                }
                else {
                  let sql2 = `select table_number as "table_num" from order_customer where id = ?`;

                  db.query(sql2, order_id, (err,result2) => {
                    if(err) {
                      db.rollback(function() {
                        res.status(500).json({
                          status: false,
                          data: err,
                          message:"Unsuccessful"
          
                      });
                      });
                    }

                    else {
                      let table_number = result2[0].table_num;
                      let sql3 = `UPDATE tables SET status = "in-active" where id = ?`;

                      db.query(sql3, table_number,(err, result3) => {
                        if(err) {
                          db.rollback(function() {
                            res.status(500).json({
                              status: false,
                              data: err,
                              message:"Unsuccessful"
              
                          });
                          });
                        }
                        db.commit(function(err) {
                            if (err) { 
                              db.rollback(function() {
                                res.status(500).json({
                                  status: false,
                                  data: err,
                                  message:"Unsuccessful"
                      });
                      });
                    }          
                  }); 

                });
              }

                  });
                }
            });
        }
        res.status(200).json({
            status: true,
            data: [result],
            message:"Successful"
        });
    });
  }
    });
});  
  

router.get('/',authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter') , (req,res) => {

    let sql = `SELECT e_cook.id as "cook_id",e_cook.name as "cook_name",e_waiter.id as "waiter_id", e_waiter.name as "waiter_name",c.name as "customer_name" ,oc.id,oc.table_number,oc.order_status,DATE_FORMAT(oc.order_time,'%Y-%m-%dT%TZ') as "order_time", DATE_FORMAT(oc.complete_time,'%Y-%m-%dT%TZ') as "complete_time", oc.bill from order_customer oc, employee e_cook,employee e_waiter, customer c where c.id = oc.customer_id and oc.cook_id = e_cook.id and oc.waiter_id = e_waiter.id and e_cook.id in (SELECT e.id  from employee e, category c where e.category_id = c.id and c.role = "cook" or c.role ="COOK") and e_waiter.id in (SELECT e.id  from employee e,category c where e.category_id = c.id and c.role = "waiter" or c.role = "WAITER") and payment_status = "non_paid" ORDER BY oc.order_time desc`;
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

router.post('/',(req,res) => {

    db.beginTransaction(function(err) {
        if(err) {
            throw err;
        }
        let column_values = {order_id: req.body.order_id, dish_id: req.body.dish_id, dish_quantity: req.body.dish_quantity};
        let total_amount = req.body.total_amount;
        let order_id = req.body.order_id;
        let dish_quantity = req.body.dish_quantity;
        let dish_id = req.body.dish_id;

        let sql = `INSERT into order_dishes SET ?`;

        db.query(sql,column_values, (err, result) => {
            if (err) { 
                db.rollback(function() {
                  throw err;
                });
              }
              let sql1 = `Update order_customer SET total_amount = total_amount + ? where id = ?`;

              db.query(sql1, [total_amount,order_id],(err,result)=>{
                if (err) { 
                  db.rollback(function() {
                    throw err;
                  });
                }
                let sql2 = `UPDATE order_customer SET bill = (total_amount * tax) + total_amount where id = ?`;
          
                db.query(sql2, order_id, (err, result) => {
                  if(err) {
                    db.rollback(function() {
                      throw err;
                    });
                  }

                  let sql3 = 

                  `UPDATE item_inventory inv 
                      JOIN ingredients ing ON 
                      inv.id = ing.item_id
                      AND dish_id = ?
                      SET inv.quantity = 
                      inv.quantity - (ing.item_quantity * ${dish_quantity})`;

                db.query(sql3,dish_id, function(err, result3) {
                  if (err) { 
                    db.rollback(function() {
                      throw err;
                    });
                  }
                db.commit(function(err) {
                    if (err) { 
                      db.rollback(function() {
                        throw err;
                      });
                    }
                    
                  });    
                });
              });
            });

              res.status(200).json({
                status: true,
                data: [result]
            });
        });    
    });   
});

router.put('/', (req,res) => {
    let column_values = {order_status: req.body.order_status, table_number: req.body.table_number, cook_id: req.body.cook_id, waiter_id: req.body.waiter_id};
    let order_id = req.body.order_id;
    let tableNumber = req.body.table_number;

    db.beginTransaction(function(err) {
      if (err) { 
        db.rollback(function() {
          throw err;
        });
      }
      else {
        let sql1 = `SELECT table_number from order_customer where id = ?`;
            db.query(sql1,order_id,(err, result1) => {
              if (err) { 
                db.rollback(function() {
                  throw err;
                });
              }
          else {
            let sql = `UPDATE order_customer SET ? where id = ?`;
            db.query(sql,[column_values,order_id], (err, result) => {
              if (err) { 
                db.rollback(function() {
                  throw err;
                });
              }
            else {
              var newTableNumber = result1[0].table_number;
              if(tableNumber != newTableNumber) {
                let sql_table = `update tables SET status = 'active' WHERE tables.id = ?`;
                db.query(sql_table,newTableNumber,(err,result2)=>{
                  if (err) { 
                    db.rollback(function() {
                      throw err;
                    });
                  }
                  db.commit(function(err) {
                    if (err) { 
                      db.rollback(function() {
                        throw err;
                      });
                    }
                    else {
                      res.status(200).json({
                          status: true,
                          data: [result]
                      });
                    }                  
                  }); 
                   
                });
              }
              else {
                res.status(200).json({
                  status: true,
                  data: [result]
              });
              }
            }

            });
        }
      });

      }
    });

});

router.delete('/:id',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter') ,(req,res) => {
    let sql = `DELETE from order_customer where id = ?`;

    db.query(sql,req.params.id, (err, result) => {
        if(err) {
            res.status(500).json({
                data: err,
                status: false,
                message:"Unsuccessful"
            });
        }
        else {
          res.status(200).json({
              status: true,
              data: [result]
          });
      }
    });
});

router.put('/my-order/:orderId',authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter') , (req,res) => {
  let column_values = {order_status: req.body.order_status, cook_id: req.body.cook_id, order_time: req.body.order_time};
  let order_id = req.params.orderId;

  let sql = `UPDATE order_customer SET ? where id = ?`;

  db.query(sql,[column_values,req.params.orderId], (err, result) => {
      if(err) {
          res.status(500).json({
              data: err,
              status: false
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
