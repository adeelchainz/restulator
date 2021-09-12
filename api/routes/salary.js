const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const authenticate = require('../../authenticate');

const db = require('./db');

router.get('/all-salaries',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{
    let sql = `SELECT salary_info.id as Id, employee.name as EmployeeName, salary_info.amount as SalaryAmount, DATE_FORMAT(salary_info.salary_for, '%M-%Y') as Month,salary_info.status as Status FROM salary_info, employee WHERE salary_info.emp_id = employee.id`;
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
                data: result,
                message: 'Data Retrieved Successfully!'
            });            
        }



    });


});


router.post('/',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{
    db.beginTransaction(function(err) {
        if (err) { throw err; }

        let sql1 = ` Insert into Salary_info SET ?`;
        db.query(sql1,req.body,(err,result)=>{
            if (err) { 
                db.rollback(function() {
                    res.status(500).json({
                        status: false,
                        data: err
        
                    });                    
                });
            }
            console.log("First query run successfully");
            var salary_info_insert_id = result.insertId;
            
            let sql2 = `Select id as categ_id FROM expense_category where name = 'salary'`;
            db.query(sql2,(err,result)=>{
                if (err) { 
                    db.rollback(function() {
                        res.status(500).json({
                            status: false,
                            data: err
            
                        });
                    });
                }
                console.log('Second query run successfully, expense_type_id retrieved');
                var expense_categ_id = result[0].categ_id; 
                
                var expense_obj = {
                    id:'',
                    expense_for: req.body.salary_for,
                    amount: req.body.amount,
                    expense_category_id: expense_categ_id,
                    type_id: salary_info_insert_id                    

                };
                if(req.body.status === 'paid'){
                    let sql3 = `Insert into expenses SET ?`;
                    db.query(sql3,expense_obj,(err,result)=>{
                        if (err) { 
                            db.rollback(function() {
                                res.status(404).json({
                                    status: false,
                                    data: err
                    
                                });
                            });
                        }
                        console.log("Third query run successfully, inserted into expenses");
    
                        db.commit(function(err) {
                            if (err) { 
                              db.rollback(function() {
                                throw err;
                              });
                            }
                            console.log('Transaction Complete, inserted into expenses and Salary_info');
                            res.json({
                              data:"Values Inserted ",
                              message: "Insert values in Salary"
                            });
                          });                    
    
    
    
                    });





                }
                else{
                    db.commit(function(err) {
                        if (err) { 
                          db.rollback(function() {
                            throw err;
                          });
                        }
                        console.log('Transaction Complete, inserted into expenses and Salary_info');
                        res.json({
                          data:"Values Inserted ",
                          message: "Insert values in Salary"
                        });
                      });                        
                }                




            });
            





        });






    });

});

module.exports = router;


