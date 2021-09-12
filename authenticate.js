var jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('./config');
const cookieParser = require('cookie-parser');


exports.verifyCustomerToken = (req,res,next) => {
  if(req.cookies['customer-token']){
    // console.log("Token Found" + req.cookies['token']);
      token = req.cookies['customer-token'];
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }
    
      if (token) {
        jwt.verify(token, config.secretKey, (err, decoded) => {
          if (err) {            
            res.clearCookie('customer-token');
            res.redirect('customer-login');                      
          } 
          else {
            req.decoded = decoded;
            next();
          }
        });
      } 
      else {
          res.redirect('customer-login');      
      }

  }
  else{
      res.redirect('customer-login');
  
  }



};


exports.verifyToken = (req,res,next)=>{
  // req.headers['x-access-token'] || req.headers['authorization']
  let token ;
  var isTokenFromHeader = false;
    if(req.headers['authorization']){
      token = req.headers['authorization'];
      console.log("Token found in header: "+ token);
      isTokenFromHeader = true;
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }
    
      if (token) {
        jwt.verify(token, config.secretKey, (err, decoded) => {
          if (err) {
              res.status(500).json({
                status:false,
                data: [],
                message:"Auth token not supplied"
              }); 
            
            
          } 
          else {
            req.decoded = decoded;
            req.isAndroid = true;
            next();
          }
        });
      }
       else {

          res.status(500).json({
            status:false,
            data: [],
            message:"Auth token not supplied"
          });
      
  
  
  
          // return res.status(401).json({
          //     message: 'You are not authorized to perform this operation'
          //   });            
          // var err = Error('You are not authorized to perform this operation!');
          // err.status = 401;
          // return next(err);        
  
      //   return res.json({
      //     success: false,
      //     message: 'Auth token is not supplied'
      //   });
      }

    }
    else if(req.cookies['token']){
      // console.log("Token Found" + req.cookies['token']);
        token = req.cookies.token;
        if (token.startsWith('Bearer ')) {
          // Remove Bearer from string
          token = token.slice(7, token.length);
        }
      
        if (token) {
          jwt.verify(token, config.secretKey, (err, decoded) => {
            if (err) {
              if(!isTokenFromHeader){
                res.clearCookie('token');
                res.redirect('/login');
              }
              
            } 
            else {
              req.decoded = decoded;
              req.isAndroid = false;
              next();
            }
          });
        } 
        else {
            res.redirect('/login');
        
  
        }

    }
    else{
        res.redirect('/login');
    
    }

    

};

// exports.verifyRole = function(role){
//     return function(req,res,next){

//       if(req.decoded.role === role){
//         next();
//       }
//       else{
//         return res.status(401).json({
//           message: 'You are not authorized to perform this operation'
//         });       

//       }
//   };

// };

exports.verifyRoles = function(...argFields){
  return function(req,res,next){
      
    if(argFields.includes(req.decoded.role)){
      next();
    }
    else{

      if(!req.isAndroid){
        res.redirect('/login');
      }
      res.status(500).json({
        status:false,
        data: [],
        message:"Not authorized to perform this operation "
      });
      
     
    }
     
};

};

exports.getEmpId = (req,res,next)=>{
    const db = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'restulator_db'
  });

  db.connect((err)=>{
      if(err){
          throw err;
      }
      console.log('MySQL connected!');
  });
  let sql = `SELECT employee.id as emp_id FROM employee, user WHERE user.emp_id = employee.id AND user.email =  ?`;
  db.query(sql,[req.decoded.email],(err, result)=>{
    if(err){
        res.status(404).json({
          data: false,
          message: "Server side query error\n" + err
      });      
    }
    req.empId = result[0].emp_id;
    console.log("Employee ID " + req.empId);
    next();    


  });


};



  

