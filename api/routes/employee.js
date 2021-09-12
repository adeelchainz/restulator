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
        cb(null,'./uploads/');

    },
    filename: function(req,file,cb) {
        cb(null,file.originalname); 
    }

});

const upload = multer({storage: storage});

router.get('/getEmployeeCategory',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter') ,(req,res)=>{

    let sql = `SELECT * from category`;
    db.query(sql,(err,result) => {
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



// const storage = multer.diskStorage({
//     destination: function(req, file,cb) {
//         cb(null,'uploads/');

//     },
//     filename: function(req,file,cb) {
//         cb(null,file.originalname); 
//     }


// });

// const fileFilter = (req,file,cb) => {

//     //reject a file
//     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true);
//     }
//     else {
//         cb(null, false);
//     }

// };

// const upload = multer({
//     storage: storage, 
//     limits: {
//     fileSize: 1024 * 1024 * 10
//     },
//     fileFilter: fileFilter

// });



//post all the details of employee
router.post('/',upload.single('image'), authenticate.verifyToken,authenticate.verifyRoles('manager','waiter') ,(req,res,next)=>{
    if(req.file != undefined) {

    let column_values = {name: req.body.name, category_id: req.body.category_id,national_identity: req.body.national_identity,
    address: req.body.address, mobile: req.body.mobile, telephone: req.body.telephone,image: req.file.path,created_at: req.body.created_at,
    gender: req.body.gender, salary: req.body.salary, join_date: req.body.join_date, birth_date: req.body.birth_date,
    branch_id: req.body.branch_id};

    let sql = `INSERT INTO employee SET ?`;
    db.query( sql,column_values, (err, result)=>{
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
    }
    else {
        let column_values = {name: req.body.name,address: req.body.address, mobile: req.body.mobile,national_identity:req.body.national_identity,telephone:req.body.telephone,
            category_id:req.body.category_id, gender:req.body.gender,created_at:req.body.created_at,join_date:req.body.join_date,birth_date:req.body.birth_date,
            branch_id:req.body.branch_id, salary:req.body.salary};

        let sql = `INSERT INTO employee SET ?`;

        db.query(sql,[column_values,req.body.id],(err,result) => {
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
    }
});

//get all the details of employee
router.get("/getAllEmployee/",authenticate.verifyToken,authenticate.verifyRoles('manager','waiter'), (req,res,next) => {
    let sql = `SELECT e.id,e.image,e.name,e.national_identity,e.telephone,e.mobile,e.address,e.image,e.created_at,e.gender,e.salary,e.join_date,e.birth_date,e.branch_id,c.role,c.id as "cat_id" from employee e,category c where e.category_id = c.id order by e.id desc`;

        db.query(sql,(err,result) =>{
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

router.delete('/:empId',authenticate.verifyToken,authenticate.verifyRoles('manager','waiter') ,(req,res) => {
    let sql = `DELETE FROM employee where id = ?`;

   db.query(sql,req.params.empId,function (err, result) {
        if (err) {
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

router.put('/',upload.single('image'),authenticate.verifyToken,authenticate.verifyRoles('manager','waiter') ,(req,res,next) => {
    if(req.file != undefined) {
        let column_values = {name: req.body.name,address: req.body.address,image:req.file.path, mobile: req.body.mobile,national_identity:req.body.national_identity,telephone:req.body.telephone,
            category_id:req.body.category_id, gender:req.body.gender,created_at:req.body.created_at,join_date:req.body.join_date,birth_date:req.body.birth_date,
            branch_id:req.body.branch_id, salary:req.body.salary};

    let sql = "UPDATE employee  SET ? WHERE id= ?";

    db.query(sql,[column_values,req.body.id],(err,result) => {
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
    }
    else {
        let column_values = {name: req.body.name,address: req.body.address, mobile: req.body.mobile,national_identity:req.body.national_identity,telephone:req.body.telephone,
            category_id:req.body.category_id, gender:req.body.gender,created_at:req.body.created_at,join_date:req.body.join_date,birth_date:req.body.birth_date,
            branch_id:req.body.branch_id, salary:req.body.salary};

        let sql = "UPDATE employee SET ? WHERE id= ?";

        db.query(sql,[column_values,req.body.id],(err,result) => {
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
    }
});

module.exports = router;