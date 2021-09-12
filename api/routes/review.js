const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mysql = require('mysql');
const router = express.Router();
const authenticate = require('../../authenticate');

const db = require('./db');

router.use(bodyParser.urlencoded({extended:true}));


router.post('/', authenticate.verifyToken,authenticate.verifyRoles('manager', 'waiter'), (req, res) => {    
    let reviewObj = {
        order_id: req.body.order_id,
        review: req.body.review,
        rating: req.body.rating
    }

    let sql = `INSERT INTO reviews SET ?`;

    db.query(sql, reviewObj, (err,result) => {
        if(err) {
            res.status(500).json({
                status: false,
                data: err
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

module.exports = router;