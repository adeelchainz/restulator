const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const authenticate = require('../../authenticate');


const db = require('./db');

router.get('/',authenticate.verifyToken,authenticate.verifyRoles('manager'),(req,res)=>{
    let sql = `SELECT expenses.id, DATE_FORMAT(expenses.expense_for, '%M-%Y') as Month, expense_category.name as Expense_Type ,expenses.amount as Value , DATE_FORMAT(expenses.expense_at,'%m/%d/%Y') as date , expenses.type_id as Type_id FROM expenses,expense_category WHERE expenses.expense_category_id = expense_category.id`;
    db.query(sql,(err,result)=>{
        if(err) {
            res.status(404).json({
                status: false,
                data: err

            });
        }

        res.status(200).json({
            status: true,
            data: result,
            message:"Data retrieved from expenses"
            
        });
        

    })


});




module.exports = router;