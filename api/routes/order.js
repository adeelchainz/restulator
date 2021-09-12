const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mysql = require('mysql');
const router = express.Router();
var config = require('../../config');
const authenticate = require('../../authenticate');

const db = require('./db');

router.use(bodyParser.urlencoded({extended:true}));

router.get('/getAllDishes/:customerId',authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter') , (req, res, next) => {
  let column_value = req.params.customerId;
    let sql = `SELECT d.id as "dish_id" ,d.name as "dish_name",d.price,dt.type_id,dt.type, od.dish_quantity,oc.id as "order_id",oc.order_time,oc.bill,oc.total_amount,oc.tax from dish d, dish_type dt,order_dishes od, order_customer oc where d.dishType_id = dt.type_id and od.dish_id = d.id and od.order_id = oc.id and oc.customer_id = ? and oc.order_time in (SELECT max(oc.order_time)  from order_customer oc WHERE oc.customer_id = ?)`;

    db.query(sql,[column_value,column_value], (err,results) => {
      if(err){
        res.status(500).json({
            data: err,
            status: false,
            message: "Server side query error\n" + err
        });
      }
      else {
        res.status(200).json({
            message:'Sending dishes list according to Customer',
            data: results,
            status: true
        }); 
      }      
    });
});

router.post('/',authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter') ,(req,res) => {
  var customer_id = req.body.customer_id;

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
        customer_id: req.body.customer_id,
        order_time: req.body.order_time,
        complete_time:req.body.complete_time,
        order_status:req.body.order_status,
        table_number: req.body.table_number,
        cook_id: req.body.cook_id,
        waiter_id: req.body.waiter_id,
        total_amount: req.body.total_amount
    };

  let sql = 'INSERT INTO order_customer SET ?';
  db.query(sql, obj, function(err, result) {
      if (err) { 
        db.rollback(function() {
          res.status(500).json({
              status: false,
              data: err
          });
      });
    }
    var order_id = result.insertId;

    let sql1 = `UPDATE order_customer SET bill = (total_amount * tax) + total_amount where id = ?`;

    db.query(sql1,order_id, function(err, result1) {
      if (err) { 
        db.rollback(function() {
          res.status(500).json({
              status: false,
              data: err
          });
      });
      }

    let sql2 = `SELECT points_per_order, points_limits, discount_percent, total_amount from order_customer where id =?`;
    
    db.query(sql2,order_id, (err, result2) => {
      if(err) {
        db.rollback(function() {
          res.status(500).json({
              status: false,
              data: err
          });
      });
      }
      var points = result2[0].points_per_order;
      var points_limit = result2[0].points_limits;
      var discount = result2[0].discount_percent;
      var total_amount = result2[0].total_amount;

      var customer_points = total_amount * points; //1.calculate points

      let sql3 = `Update customer SET points = points + ? where id = ?`; //update customer table and add new points

      db.query(sql3,[customer_points,customer_id], (err,result3) => {
        if(err) {
          db.rollback(function() {
            res.status(500).json({
                status: false,
                data: err
            });
        });
        }

      let sql4 = `SELECT points from customer where id = ?`; //retieve the new updated points

      db.query(sql4, customer_id, (err,result4) => {
        if(err) {
          db.rollback(function() {
            res.status(500).json({
                status: false,
                data: err
            });
        });
        }
        updatedCustomer_points = result4[0].points;

        if(updatedCustomer_points >= points_limit) { //check if update points greater than the points specified by manager

          total_amount = total_amount - (total_amount * discount);

          let sql5 = `UPDATE order_customer SET total_amount = ? where id = ?`; //total amount is updated with discounted price

          db.query(sql5,[total_amount,order_id], (err, result5) => {
            if(err) {
              db.rollback(function() {
                res.status(500).json({
                    status: false,
                    data: err
                });
            });
            }
            let sql6 = `UPDATE order_customer SET bill = (total_amount * tax) + total_amount where id = ?`; //new bill is calculated

            db.query(sql6,order_id, (err,result6) => {
              if(err) {
                db.rollback(function() {
                  res.status(500).json({
                      status: false,
                      data: err
                  });
              });                   
              }

             var newCustomerPoints = updatedCustomer_points - points_limit;

             let sql7 = `UPDATE customer SET points = ? where id = ?`; //points are deducted after they are used

             db.query(sql7, [newCustomerPoints, customer_id], (err, result7) => {
               if(err) {
                db.rollback(function() {
                  res.status(500).json({
                      status: false,
                      data: err  
                  });
              });
               }
               for(var i in req.body.dishes) {

                var orderObj = {
                    order_id: order_id,
                    dish_id: req.body.dishes[i][0],
                    dish_quantity:req.body.dishes[i][1]
                };
        
                let sql8 = 'INSERT INTO order_dishes SET ?';
                db.query(sql8, orderObj, function(err, result2) {
                  if (err) { 
                    db.rollback(function() {
                      res.status(500).json({
                          status: false,
                          data: err    
                      });
                  });
                  }

                  // subtract ingredient quantity from inventory.

                  let sql9 = 

                  `UPDATE item_inventory inv 
                      JOIN ingredients ing ON 
                      inv.id = ing.item_id
                      AND dish_id = ?
                      SET inv.quantity = 
                      inv.quantity - (ing.item_quantity * ${orderObj.dish_quantity})`;

                  db.query(sql9, orderObj.dish_id, function(err, result3) {
                    if (err) { 
                      db.rollback(function() {
                        res.status(500).json({
                            status: false,
                            data: err 
                        });
                    });
                    }
                    let sql_table = `update tables SET status = 'active' WHERE tables.id = ?`;
                    db.query(sql_table,req.body.table_number,(err,result)=>{
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
             });
            });

              } 
            });
          });

        });

        res.status(200).json({
          message: "Order is created",
          status: true,
          data: [result]
        });

    }
        else {
            for(var i in req.body.dishes) {

              var orderObj = {
                  order_id: order_id,
                  dish_id: req.body.dishes[i][0],
                  dish_quantity:req.body.dishes[i][1]
              };
      
              let sql2 = 'INSERT INTO order_dishes SET ?';
              db.query(sql2, orderObj, function(err, result2) {
                if (err) { 
                  db.rollback(function() {
                    res.status(500).json({
                        status: false,
                        data: err
                    });
                });
                }  
                // subtract ingredient quantity from inventory.
                
                let sql9 = 

                `UPDATE item_inventory inv 
                    JOIN ingredients ing ON 
                    inv.id = ing.item_id
                    AND dish_id = ?
                    SET inv.quantity = 
                    inv.quantity - (ing.item_quantity * ${orderObj.dish_quantity})`;
                


                  db.query(sql9, orderObj.dish_id, function(err, result3) {
                    if (err) { 
                      db.rollback(function() {
                        res.status(500).json({
                            status: false,
                            data: err
                        });
                    });
                    }
                    let sql_table2 = `update tables SET status = 'active' WHERE tables.id = ?`;
                    db.query(sql_table2,req.body.table_number,(err,result)=>{
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
                  });   
          }); 
        }
        res.status(200).json({
          message: "Order is created",
          status: true,
          data: [result]
        });
    }
      });

    });

  });

});

});
});
});
 
router.delete('/',authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter'), (req,res) => {
  let order_id = req.body.order_id;
  let dish_id = req.body.dish_id;
  let total_price =  req.body.total_amount;

  db.beginTransaction(function(err) {
    if (err) { 
      db.rollback(function() {
        res.status(500).json({
            status: false,
            data: err
        });
      });
    }

  let sql = `SELECT count(order_id) as count FROM order_dishes WHERE order_id = ?`;

  db.query(sql, order_id,(err,result)=>{
    if (err) { 
      db.rollback(function() {
        res.status(500).json({
            status: false,
            data: err
        });
    });
    }

  if(result[0].count == 1) {

    let sql1 = `DELETE from order_customer where id = ?`;

    db.query(sql1,order_id, (err,result) => {
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

      res.status(200).json({
        message: 'Last dish deleted!!',
        data: [result],
        status: true
      });

    });
  }
  else { 

  let sql3 = `DELETE from order_dishes where order_id = ? and dish_id = ?`;

  db.query(sql3,[order_id,dish_id], (err, result) => {
    if (err) { 
      db.rollback(function() {
        res.status(500).json({
            status: false,
            data: err
        });
    });
    }

    let sql1 = `Update order_customer SET total_amount = total_amount - ? where id = ?`;
    db.query(sql1, [total_price,order_id],(err,result)=>{
      if (err) { 
        db.rollback(function() {
          res.status(500).json({
              status: false,
              data: err
          });
      });
      }
      let sql2 = `UPDATE order_customer SET bill = (total_amount * tax) + total_amount where id = ?`;

      db.query(sql2, order_id, (err, result) => {
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
    });

        res.status(200).json({
          message: 'Dish deleted!!',
          data: [result],
          status: true
        });
    });
  }
  });

  });
});

router.put('/',authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter') , (req, res) => {
  let order_id = req.body.order_id;
  let dish_id = req.body.dish_id;
  let dish_quantity = req.body.dish_quantity;
  let total_amount = req.body.total_amount;

  db.beginTransaction(function(err) {

      if (err) {
        db.rollback(function() {
          res.status(500).json({
              status: false,
              data: err
          });
        });
      }

      // ingredients 

      let sql0 = `
          UPDATE item_inventory inv 
                JOIN ingredients ing ON 
                inv.id = ing.item_id
                JOIN order_dishes od ON 
                od.dish_id = ing.dish_id
                AND od.order_id = ?
                AND ing.dish_id = ?
                SET inv.quantity = 
                inv.quantity + (ing.item_quantity * od.dish_quantity)`;

      db.query(sql0, [order_id, dish_id], (err, result) => {
          if (err) {
            db.rollback(function() {
              res.status(500).json({
                  status: false,
                  data: err
              });
          });
          }

          //ingredients


          let sql = `UPDATE order_dishes SET dish_quantity = ? where order_id = ? and dish_id = ?`;

          db.query(sql, [dish_quantity, order_id, dish_id], (err, result) => {
              if (err) {
                db.rollback(function() {
                  res.status(500).json({
                      status: false,
                      data: err
                  });
              });
              }

              let sql00 =

                  `UPDATE item_inventory inv 
                  JOIN ingredients ing ON 
                  inv.id = ing.item_id
                  AND dish_id = ?
                  SET inv.quantity = 
                  inv.quantity - (ing.item_quantity * ${dish_quantity})`;



              db.query(sql00, dish_id, function(err, result3) {
                  if (err) {
                    db.rollback(function() {
                      res.status(500).json({
                          status: false,
                          data: err
                      });
                  });
                  }

                  let sql1 = `Update order_customer SET total_amount = total_amount - ? where id = ?`;

                  db.query(sql1, [total_amount, order_id], (err, result) => {
                      if (err) {
                        db.rollback(function() {
                          res.status(500).json({
                              status: false,
                              data: err      
                          });
                      });
                      }
                      let sql2 = `UPDATE order_customer SET bill = (total_amount * tax) + total_amount where id = ?`;

                      db.query(sql2, order_id, (err, result) => {
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
                  });
                  res.status(200).json({
                      message: 'Dish edited!!',
                      data: [result],
                      status: true
                  });
              });

          });
      });
  });
});
module.exports = router;
