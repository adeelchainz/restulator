const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const router = express.Router();
const authenticate = require('../../authenticate');

const db = require('./db');

router.use(bodyParser.urlencoded({extended:true}));


const storage = multer.diskStorage({
    destination: function(req, file,cb) {
        cb(null,'/uploads/');

    },
    filename: function(req,file,cb) {
        cb(null,file.originalname); 
    }



});

const upload = multer({storage: storage});

router.get('/',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{
  let sql = `SELECT supply_info.id as SupplyId, supplier.name as SupplierName,supply_info.supplier_id, DATE_FORMAT(supply_info.supply_at,'%Y-%m-%dT%TZ') as supply_at, item_inventory.name as item_name, item_supply.quantity,item_supply.item_id as item_id, item_supply.unit_price, supply_info.payment, supply_info.bill, supply_info.payment_status FROM item_supply, supply_info, item_inventory,supplier WHERE supply_info.supplier_id = supplier.id AND item_supply.supply_info_id = supply_info.id AND item_supply.item_id = item_inventory.id ORDER BY supply_info.id ASC`;
  db.query(sql,(err,result)=>{
    if(err){
      res.status(500).json({
        status: false,
        data: err

    });      
    }
    else{
      res.status(200).json({
        status:true,
        data:result,
        message: "All supplies data"
        }); 
    } 
   
  });




});




router.post('/',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{
    db.beginTransaction(function(err) {
        if (err) {
          res.status(500).json({
            status: false,
            data: err

        });
        }
        var obj = {
            id:'',
            supplier_id: req.body.supplier_id,
            supply_at: req.body.supply_at,
            bill: req.body.bill,
            payment: req.body.payment,
            payment_status: req.body.payment_status

        };
        let sql1 = 'INSERT INTO supply_info SET ?'
        db.query(sql1, obj, function(err, result) {
          console.log("Values Inserted into Supply info")
            if (err) { 
            db.rollback(function() {
              res.status(500).json({
                status: false,
                data: err

            });              
            });
          }
          // console.log("First query run successfully");
          var supply_info_id_result = result.insertId;
          console.log(supply_info_id_result);


          if(req.body.payment_status === 'paid'){
            let sql4 = `Select id as categ_id FROM expense_category where name = 'purse'`;
            db.query(sql4,(err,result)=>{
              if (err) { 
                db.rollback(function() {
                  res.status(500).json({
                    status: false,
                    data: err
    
                });                    
                });
              }
              // console.log('Fourth query run successfully, expense_type_id retrieved');
              var expense_categ_id = result[0].categ_id;
              var supply_datetime = new Date(req.body.supply_at);
              var expense_obj = {
                id:'',
                expense_for: req.body.supply_at,
                amount: req.body.payment,
                expense_category_id: expense_categ_id,
                type_id: supply_info_id_result

              }

              let sql5 = `Insert into expenses SET ?`;
              db.query(sql5,expense_obj,(err,result)=>{
                if (err) { 
                  res.status(500).json({
                    status: false,
                    data: err
    
                });
                }
                // console.log('Fifth Query run successfully, inserted into expenses');


                var itemSupply_obj = {
                  supply_info_id: supply_info_id_result,
                  item_id: req.body.item_id,
                  quantity:req.body.quantity,
                  unit_price: req.body.unit_price
                  
    
                };
                let sql2 = 'INSERT INTO item_supply SET ?';
                db.query(sql2, itemSupply_obj, function(err, result) {
                  if (err) { 
                    db.rollback(function() {
                      res.status(500).json({
                        status: false,
                        data: err
        
                    });
                    });
                  }  
                  // console.log("Second query run successfully");
                  let sql3 = `UPDATE item_inventory SET quantity = quantity + '${req.body.quantity}' WHERE id = '${req.body.item_id}'`;
                  db.query(sql3, function(err, result) {
                      if (err) { 
                        db.rollback(function() {
                          res.status(500).json({
                            status: false,
                            data: err
            
                        });
                        });
                      }  
                      // console.log("Inserted id " +result.insertId );
                      // console.log("Third query run successfully");
      
      
      
                      db.commit(function(err) {
                          if (err) { 
                            db.rollback(function() {
                              res.status(500).json({
                                status: false,
                                data: err
                
                            });                              
                            });
                          }
                          // console.log('Transaction Complete.');
                          res.status(200).json({
                            status:true,
                            data:"Values Inserted",
                            message: "Insert values in Supply"
                          });
                        });    
                    });
                });


              });

          });

        }
        else{
          var itemSupply_obj = {
            supply_info_id: supply_info_id_result,
            item_id: req.body.item_id,
            quantity:req.body.quantity,
            unit_price: req.body.unit_price
            

          };
          let sql2 = 'INSERT INTO item_supply SET ?';
          db.query(sql2, itemSupply_obj, function(err, result) {
            if (err) { 
              db.rollback(function() {
                res.status(500).json({
                  status: false,
                  data: err
  
              });                
              });
            }  
            console.log("Second query run successfully");
            let sql3 = `UPDATE item_inventory SET quantity = quantity + '${req.body.quantity}' WHERE id = '${req.body.item_id}'`;
            db.query(sql3, function(err, result) {
                if (err) { 
                  db.rollback(function() {
                    res.status(500).json({
                      status: false,
                      data: err
      
                  });
                  });
                }  
                // console.log("Inserted id " +result.insertId );
                // console.log("Third query run successfully");



                db.commit(function(err) {
                    if (err) { 
                      db.rollback(function() {
                        res.status(500).json({
                          status: false,
                          data: err
          
                      });
                      });
                    }
                    // console.log('Transaction Complete.');
                    res.status(200).json({
                      status:true,
                      data:"Values Inserted",
                      message: "Insert values in Supply"
                    });
                    // db.end();
                  });    
              });
          });          

        }



      });    







});
});




router.get('/:id',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{
    // let item_id= req.params.id;
    // console.log("Selecting on " + item_id);
    let sql = `SELECT DISTINCT item_inventory.name, item_inventory.Quantity,Count(ingredients.dish_id) as RecipeCount, item_inventory.unit as Unit, DATE_FORMAT(supply_info.supply_at,'%Y-%m-%dT%TZ') as supply_at,supplier.name as Supplier, SUM(item_supply.quantity) as TotalPurse, SUM(ingredients.item_quantity*order_dishes.dish_quantity) as Total_Cooked FROM item_supply, supply_info,supplier, item_inventory,ingredients,order_dishes WHERE item_supply.supply_info_id = supply_info.id AND supply_info.supplier_id = supplier.id AND item_supply.item_id = item_inventory.id AND ingredients.dish_id = order_dishes.dish_id AND ingredients.item_id = item_inventory.id AND item_inventory.id = ? order by supply_info.supply_at LIMIT 1`;
    db.query(sql,req.params.id,(err,result)=>{
        if(err) {
          res.status(500).json({
            status: false,
            data: err
  
        });           
        }
        else{
          res.status(200).json({
            status:true,
            data:result,
            message:"Supplies selected on item id"
          });

        }        

    });


});

router.put('/:id',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{

  db.beginTransaction(function(err){
    if (err) { 
        res.status(500).json({
          status: false,
          data: err

      });      
     }
    var obj = {
        supplier_id: req.body.supplier_id,
        supply_at: req.body.supply_at,
        bill: req.body.bill,
        payment: req.body.payment,
        payment_status: req.body.payment_status

    };
    let sql1 = `Update supply_info SET ? where id = ?`;
    db.query(sql1, [obj,req.params.id],(err,result)=>{
      if (err) { 
        db.rollback(function() {
          res.status(500).json({
            status: false,
            data: err

        });
        });
      }
      // console.log("First Query run successfully");
      console.log("Supply_info_id: " + req.params.id);
      let sql2 = `Select * FROM item_supply WHERE supply_info_id = ?`;
      db.query(sql2, [req.params.id],(err,result)=>{
        if (err) { 
          db.rollback(function() {
            res.status(500).json({
              status: false,
              data: err

          });
          });
        }
        // console.log("Second Query run successfully");
        console.log("Item_ID "+result[0]);
        if(req.body.item_id == result[0].item_id ){

          if(req.body.quantity == result[0].quantity ){
            var item_supply_obj = {
              item_id: req.body.item_id,
              quantity:req.body.quantity,
              unit_price: req.body.unit_price
            };
            let sql3 = `Update item_supply SET ? WHERE supply_info_id = ?`;
            db.query(sql3,[item_supply_obj,req.params.id],(err,result)=>{
              if (err) { 
                db.rollback(function() {
                  res.status(500).json({
                    status: false,
                    data: err
    
                });
                });
              }
              // console.log("Third Query run Successfully");
              db.commit(function(err) {
                if (err) { 
                  db.rollback(function() {
                    res.status(500).json({
                      status: false,
                      data: err
      
                  });
                  });
                }
                // console.log('Transaction Complete.');
                res.status(200).json({
                  status:true,
                  data:"Values Updated",
                  message: "Updated values in Supply"
                });
                // db.end();
              });             
  
  
            });
  
  
          }
          
          else if(req.body.quantity > result[0].quantity ){
            var item_id = result[0].item_id;
            var diff = req.body.quantity - result[0].quantity;
            var item_supply_obj = {
              item_id: req.body.item_id,
              quantity:req.body.quantity,
              unit_price: req.body.unit_price
            };
            sql4 = `Update item_supply SET ? WHERE supply_info_id = ?`;
            db.query(sql4,[item_supply_obj,req.params.id],(err,result)=>{
              if (err) { 
                db.rollback(function() {
                  res.status(500).json({
                    status: false,
                    data: err
    
                });
                });
              }
              // console.log("Third Query run successfully");
              let sql5 = `Update item_inventory SET quantity=quantity + ? WHERE id = ?`;
              db.query(sql5,[diff,item_id],(err,result)=>{
                if (err) { 
                  db.rollback(function() {
                    res.status(500).json({
                      status: false,
                      data: err
      
                  });
                  });
                }
                // console.log("Fourth Query Run Successfully, item_inventory updated");
                db.commit(function(err) {
                  if (err) { 
                    db.rollback(function() {
                      res.status(500).json({
                        status: false,
                        data: err
        
                    });
                    });
                  }
                  // console.log('Transaction Complete.');
                  res.status(200).json({
                    status:true,
                    data:"Values Updated",
                    message: "Updated values in Supply"
                  });
                  // db.end();
                });              
  
                
              });            
  
  
  
  
            });
  
          }
  
          else if(req.body.quantity < result[0].quantity){
            var item_id = result[0].item_id;
            var diff = result[0].quantity - req.body.quantity ;
            var item_supply_obj = {
              item_id: req.body.item_id,
              quantity:req.body.quantity,
              unit_price: req.body.unit_price
            };
            sql4 = `Update item_supply SET ? WHERE supply_info_id = ?`;
            db.query(sql4,[item_supply_obj,req.params.id],(err,result)=>{
              if (err) { 
                db.rollback(function() {
                  res.status(500).json({
                    status: false,
                    data: err
    
                });
                });
              }
              // console.log("Third Query run successfully");
              let sql5 = `Update item_inventory SET quantity=quantity - ? WHERE id = ?`;
              db.query(sql5,[diff,item_id],(err,result)=>{
                if (err) { 
                  db.rollback(function() {
                    res.status(500).json({
                      status: false,
                      data: err
      
                  });
                  });
                }
                // console.log("Fourth Query Run Successfully, item_inventory updated");
                db.commit(function(err) {
                  if (err) { 
                    db.rollback(function() {
                      res.status(500).json({
                        status: false,
                        data: err
        
                    });
                    });
                  }
                  // console.log('Transaction Complete.');
                  res.status(200).json({
                    status:true,
                    data:"Values Updated",
                    message: "Updated values in Supply"
                  });
                  // db.end();
                });              
  
                
              });            
  
  
  
  
            });          
  
  
  
  
          }







        }
        else{

          let sql6 = `UPDATE item_inventory SET quantity = quantity - ? WHERE id = ?`;
          db.query(sql6,[result[0].quantity, result[0].item_id],(err,result)=>{
            if (err) { 
              db.rollback(function() {
                res.status(500).json({
                  status: false,
                  data: err
  
              });
              });
            }
            // console.log("Third query run successfully, previous item_supply removed from item_inventory");
            var item_supply_obj = {
              item_id: req.body.item_id,
              quantity:req.body.quantity,
              unit_price: req.body.unit_price
            };  
            let sql7 = `UPDATE item_supply SET ? WHERE supply_info_id = ?`;
            db.query(sql7,[item_supply_obj,req.params.id],(err,result)=>{
              if (err) { 
                db.rollback(function() {
                  res.status(500).json({
                    status: false,
                    data: err
    
                });
                });
              } 
              // console.log("Fourth Query run successfully ,item_supply updated");
              let sql8 = `UPDATE item_inventory SET quantity = quantity + ? WHERE id = ?`;
              db.query(sql8,[req.body.quantity,req.body.item_id],(err,result)=>{
                if (err) { 
                  db.rollback(function() {
                    res.status(500).json({
                      status: false,
                      data: err
      
                  });
                  });
                }
                // console.log("Fifth query run successfully, item_inventory updated");
                db.commit(function(err) {
                  if (err) { 
                    db.rollback(function() {
                      res.status(500).json({
                        status: false,
                        data: err
        
                    });
                    });
                  }
                  // console.log('Transaction Complete.');
                  res.status(200).json({
                    status:true,
                    data:"Values Updated",
                    message: "Updated values in Supply"
                  });
                  // db.end();
                });                



              });
              
            });          




          });

        }

      });





    });

  });

});



router.delete('/:id',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{
  db.beginTransaction(function(err){
    if (err) { 
      res.status(500).json({
        status: false,
        data: err

    });      
     }
    let sql1 = `Select item_supply.item_id, item_supply.quantity FROM item_supply, supply_info WHERE item_supply.supply_info_id=supply_info.id AND item_supply.supply_info_id = ?`;
    db.query(sql1,req.params.id,(err,result)=>{
      if (err) { 
        db.rollback(function() {
          res.status(500).json({
            status: false,
            data: err

        });
        });
      }
      // console.log("First query run successfully");
      console.log(result[0].item_id + " " + result[0].quantity);
      let sql2 = `UPDATE item_inventory SET quantity = quantity - ? WHERE id = ?`;
      db.query(sql2,[result[0].quantity,result[0].item_id],(err,result)=>{
        if (err) { 
          db.rollback(function() {
            res.status(500).json({
              status: false,
              data: err

          });
          });
        }
        // console.log("Second Query run Successfully");
        let sql3 = `Delete From supply_info WHERE id='${req.params.id}'`;
        db.query(sql3,(err,result)=>{
          if (err) { 
            db.rollback(function() {
              res.status(500).json({
                status: false,
                data: err

            });
            });
          }
          // console.log("Third Query Run Successfully");
          db.commit(function(err) {
            if (err) { 
              db.rollback(function() {
                res.status(500).json({
                  status: false,
                  data: err
  
              });
              });
            }
            // console.log('Delete Transaction Complete.');
            res.status(200).json({
              status:true,
              data:"Supply Deleted",
              message: "Deleted supply"
            });            
            // db.end();
          });          




        });



      });

    });

  });  






});



module.exports = router;