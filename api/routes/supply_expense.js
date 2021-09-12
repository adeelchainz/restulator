const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const authenticate = require('../../authenticate');


const db = require('./db');

router.get('/:id',authenticate.verifyToken,authenticate.verifyRoles('manager'), (req, res)=>{
    let sql = `SELECT  supplier.name as SupplierName, DATE_FORMAT(SUPPLY_AT, '%Y-%m-%dT%TZ') AS supply_at, supply_info.bill, supply_info.payment, supply_info.payment_status FROM SUPPLY_INFO,supplier  WHERE supply_info.supplier_id = supplier.id AND supply_info.id =  ?`;
    let query = db.query(sql, [req.params.id],(err, result)=> {
        if(err){
            res.status(500).json({
                status: false,
                data: false,
                message:err

            });
        }
        else{
            res.status(200).json({
                status:true,
                data: result,
                message: 'Data Retrieved Successfully!'
            });


        }

    })
});

router.get('/items/:id',authenticate.verifyToken,authenticate.verifyRoles('manager'), (req, res)=>{
    let sql = `SELECT item_inventory.name as Product_Name, item_supply.quantity as Item_Quantity, 
    item_supply.unit_price as Unit_Price FROM item_supply, item_inventory,supply_info WHERE 
    supply_info.id = item_supply.supply_info_id AND item_supply.item_id = item_inventory.id AND supply_info.id =  ?`;
    let query = db.query(sql, [req.params.id],(err, result)=> {
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

    })
});






module.exports = router;