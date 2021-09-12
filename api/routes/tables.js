const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const authenticate = require('../../authenticate');

const db = require('./db');

router.get('/',(req,res)=>{

    let sql= `Select * FROM tables`;
    db.query(sql,(err,result)=>{
        if(err){
            res.status(500).json({
                status:false,
                data: false,
                message: err
            });            
        }
        else{
            res.status(200).json({
                status:true,
                data: result,
                message: 'Tables Data!'
            });
        }
        

    });
});

router.get('/order/:tableId',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter'),(req,res)=>{

    let sql= `SELECT oc.id,e_cook.name as "cook_name",c.name as "customer_name" ,oc.order_status, DATE_FORMAT(oc.order_time,'%Y-%m-%dT%TZ')
            as "order_time",DATE_FORMAT(oc.complete_time,'%Y-%m-%dT%TZ') as "complete_time", oc.bill,oc.payment_status from order_customer oc,
            employee e_cook, customer c where c.id = oc.customer_id and oc.cook_id = e_cook.id and 
            e_cook.id in (SELECT e.id  from employee e, category c where e.category_id = c.id and c.role = "cook" or c.role ="COOK") 
            and oc.table_number = ? order by oc.order_time desc LIMIT 1`;

    db.query(sql,req.params.tableId,(err,result)=>{
        if(err){
            res.status(500).json({
                status:false,
                data: [],
                message: err
            });            
        }
        else{
            res.status(200).json({
                status:true,
                data: result,
                message: 'Order Retreived!'
            });
        }
        

    });
});


router.get('/all',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter'),(req,res)=>{

    let sql= `Select * FROM tables`;
    db.query(sql,(err,result)=>{
        if(err){
            res.status(500).json({
                status:false,
                data: [], 
                message: 'Unsuccessful'
            });            
        }
        else{
            res.status(200).json({
                status: true,
                data: result,
                message: 'Successful'
            });
        }
    });
});

router.get('/availableTables',(req,res)=>{
    let sql = `SELECT * FROM tables WHERE tables.status = 'in-active' `;
    db.query(sql,(err,result)=>{
        if(err){
            res.status(500).json({
                status:false,
                data: false,
                message: err
            });            
        }
        else{
            res.status(200).json({
                status:true,
                data: result,
                message: 'Available Tables Data!'
            });


        }
 



    })
})


router.post('/',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{
    let sql = `INSERT into tables SET ?`;
    db.query(sql,req.body,(err,result)=>{
        if(err){
            res.status(500).json({
                status:false,
                data: false,
                message: err
            });            
        }
        else{
            res.status(200).json({
                status:true,
                data: 'Table Added',
                message: 'Table Added Successfully!'
            });
        }
        


    });


});

router.put('/:tableId',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter'),(req,res)=>{
    let sql = `Update tables SET ? WHERE tables.id = ?`;
    db.query(sql,[req.body,req.params.tableId],(err,result)=>{
        if(err){
            res.status(500).json({
                status:false,
                data: false,
                message: err
            });            
        }
        else{
            res.status(200).json({
                status:true,
                data: 'Table Updated',
                message: 'Table Updated Successfully!'
            });

        }
         

    });

});


router.delete('/:tableId',authenticate.verifyToken,authenticate.verifyRoles('manager',),(req,res)=>{
    let sql = `DELETE FROM tables WHERE tables.id = ?`;
    db.query(sql,req.params.tableId,(err,result)=>{
        if(err){
            res.status(500).json({
                status:false,
                data: false,
                message: err
            });            
        }
        else{
            res.status(200).json({
                status:true,
                data: 'Table Deleted Successfully',
                message: 'Table Deleted Successfully'
            }); 


        }
        


    });




});

module.exports = router;