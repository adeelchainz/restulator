const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

const mysql = require('mysql');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const authenticate = require('./authenticate');
const kitchenRoutes = require('./api/routes/kitchen');

//const registerRoutes = require('./api/routes/register');
const customer_route = require('./api/routes/customer');
const itemCategory_route = require('./api/routes/itemCategory');

const itemInventory_route = require('./api/routes/itemInventory');

const employeeRoutes = require('./api/routes/employee');
const employeeCategoryRoutes = require('./api/routes/employeeCat');

const item_Supply_route = require('./api/routes/itemSupply');


const getItems_route = require('./api/routes/itemInventory');

const itemCountByCategory = require('./api/routes/itemInventory-Category');

const userRoutes = require('./api/routes/user');
const supplierRoutes = require('./api/routes/supplier');
const supplyRoutes = require('./api/routes/supply');

const dashboardRoutes = require('./api/routes/dashboard');

const apiRoute = require('./api/api');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


userRoutes.use(bodyParser);
supplierRoutes.use(bodyParser);
supplyRoutes.use(bodyParser);
kitchenRoutes.use(bodyParser);



const orderRoutes = require('./api/routes/order');
const allOrderRoutes = require('./api/routes/allOrders');

const dish_TypeRoutes = require('./api/routes/dishType');


const dishRoutes = require('./api/routes/dish');

const customerRouter = require('./api/routes/customer');

const nonPaidOrderRoutes = require('./api/routes/nonPaidOrders');

app.use(morgan('dev'));


app.use(express.static('static_files'));

app.use(cookieParser());

app.set('view engine', 'ejs');

app.use('/api',apiRoute);

app.get('/',(req,res)=>{
    res.redirect('/dashboard');
})


app.get('/login',(req, res)=>{    
    res.render('login',{});
});


app.get('/logout',authenticate.verifyToken,(req,res)=>{

    res.clearCookie('token');
    res.redirect('/login');


});

app.get('/supplier-info', authenticate.verifyToken, (req, res)=>{
    console.log("Role in app.js : " + req.decoded.role);
    if(req.decoded.role === 'Manager' || req.decoded.role === 'manager'){
        res.render('supplier',{role: req.decoded.role});        
    }
    else{
        res.redirect('/login');
    }

});

app.get('/dashboard',authenticate.verifyToken, authenticate.getEmpId,(req,res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){
        res.render('dashboard_manager',{role:req.decoded.role});
    }
    else if(req.decoded.role === 'Waiter' ||  req.decoded.role === 'waiter'){
        res.render('dashboard',{role:req.decoded.role});
    }
    else if(req.decoded.role === 'Cook' || req.decoded.role === 'cook'){
        res.render('kitchen',{role:req.decoded.role});
    }

});

app.get('/tables-management/add-table',authenticate.verifyToken,(req,res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){

        res.render('addTable',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }


});

app.get('/tables-management/all-tables',authenticate.verifyToken,(req,res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){

        res.render('allTable',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }


});

app.get('/stock-management/all-purses',authenticate.verifyToken,(req,res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){

        res.render('allPurses',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }
});

app.get('/stock-management/all-stocks',authenticate.verifyToken,(req,res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){

        res.render('allStock',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }    
});
app.get('/stock-management/add-item',authenticate.verifyToken,(req,res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){

        res.render('addItem',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }    
});
app.get('/stock-management/new-purse',authenticate.verifyToken,(req,res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){

        res.render('newPurse',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }    
});

app.get('/accounting/expense/add-expense',authenticate.verifyToken,(req,res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){

        res.render('addExpense',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    } 



});

app.get('/accounting/expense/all-expenses',authenticate.verifyToken,(req,res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){

        res.render('allExpenses',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    } 



});

app.get('/accounting/expense/all-expenses/expense-detail',authenticate.verifyToken,(req,res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){

        res.render('expense-detail',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    } 



});

app.get('/accounting/expense/all-salaries',authenticate.verifyToken,(req,res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){

        res.render('allSalaries',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    } 



});




app.get('/live-kitchen',authenticate.verifyToken,(req, res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager' || req.decoded.role === 'Waiter' ||  req.decoded.role === 'waiter'|| req.decoded.role === 'Cook' ||  req.decoded.role === 'cook'){

        res.render('kitchen',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }     
});

app.get('/reports/waiter-report',authenticate.verifyToken, (req, res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){

        res.render('waiter-report',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }     
});


app.get('/reports/dish-report', authenticate.verifyToken,(req, res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){

        res.render('dish-report',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }       
});


app.get('/accounting/income', authenticate.verifyToken,(req, res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){

        res.render('income',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }       
});



app.get('/employee/all-employees',authenticate.verifyToken,(req,res)=>{
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){

        res.render('allEmployee',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }     
});

app.get('/employee/add-employee',authenticate.verifyToken,(req,res) => {
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager'){

        res.render('addEmployee',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }    
});

app.get('/dish/add-dish',authenticate.verifyToken, (req,res)=> {
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager' || req.decoded.role === 'Waiter' ||  req.decoded.role === 'waiter' ){

        res.render('addDish',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }
});

app.get('/dish/all-dishes',authenticate.verifyToken, (req,res) => {
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager' || req.decoded.role === 'Waiter' ||  req.decoded.role === 'waiter' ){

        res.render('allDish',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }    
});

app.get('/dish/view-ingredients',authenticate.verifyToken, (req,res) => {
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager' || req.decoded.role === 'Waiter' ||  req.decoded.role === 'waiter' ){

        res.render('view-ingredients',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }    
});




app.get('/orders/all-orders',authenticate.verifyToken,(  req,res) => {
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager' || req.decoded.role === 'Waiter' ||  req.decoded.role === 'waiter' ){

        res.render('allOrders',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }     
});

app.get('/orders/add-order',authenticate.verifyToken,(req,res)=> {
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager' || req.decoded.role === 'Waiter' ||  req.decoded.role === 'waiter' ){

        res.render('newOrders',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }     
});

app.get('/orders/non-paid-orders',authenticate.verifyToken, (req,res) => {
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager' || req.decoded.role === 'Waiter' ||  req.decoded.role === 'waiter' ){

        res.render('nonPaidOrders',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }     
});

app.get('/orders/payment-order',authenticate.verifyToken, (req,res) => {
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager' || req.decoded.role === 'Waiter' ||  req.decoded.role === 'waiter' ){

        res.render('payment-order',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }     
});

app.get('/dashboard/waiter',authenticate.verifyToken, (req,res) => {
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager' || req.decoded.role === 'Waiter' ||  req.decoded.role === 'waiter' ){

        res.render('dashboard',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }     
});

app.get('/orders/my-order',authenticate.verifyToken,authenticate.getEmpId, (req,res) => {
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager' || req.decoded.role === 'Waiter' ||  req.decoded.role === 'waiter' ){
        console.log("ID" + req.empId + " Role:"+ req.decoded.role);
        res.render('my-order',{role:req.decoded.role,emp_id: req.empId});
    }
    else{
        res.redirect('/login');
    }    
});

app.get('/signup', (req,res) => {
    res.render('signup', {});
});


app.get('/reports/cook-report',authenticate.verifyToken, (req,res) => {
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager' || req.decoded.role === 'Cook' ||  req.decoded.role === 'cook'){

        res.render('cook-report',{role:req.decoded.role});
    }
    else{
        res.redirect('/login');
    }    
});

app.get('/waiter/live-orders',authenticate.verifyToken, authenticate.getEmpId, (req,res) => {
    if(req.decoded.role === 'Waiter' ||  req.decoded.role === 'waiter'){

        res.render('waiter-live-orders.ejs',{role:req.decoded.role,emp_id: req.empId});
    }
    else{
        res.redirect('/login');
    }    
});


app.get('/cooking-history',authenticate.verifyToken,authenticate.getEmpId, (req,res) => {
    if(req.decoded.role === 'Cook' ||  req.decoded.role === 'cook' ){

        res.render('cookHistory',{role:req.decoded.role,emp_id: req.empId});
    }
    else{
        res.redirect('/login');
    }    
});

app.get('/add-customer',authenticate.verifyToken,authenticate.getEmpId, (req,res) => {
    if(req.decoded.role === 'Manager' ||  req.decoded.role === 'manager' || req.decoded.role === 'Waiter' ||  req.decoded.role === 'waiter' ){

        res.render('add-customer',{role:req.decoded.role,emp_id: req.empId});
    }
    else{
        res.redirect('/login');
    }    
});

app.get('/customer-login',(req,res) => {
    res.render('customer-login');
})

app.get('/customer-details',authenticate.verifyCustomerToken,(req,res)=>{
    console.log(req.decoded.id);
    res.render('customer-details',{cust_id: req.decoded.id});

});

app.get('/customer-logout',authenticate.verifyCustomerToken,(req,res)=>{

    res.clearCookie('customer-token');
    res.redirect('/customer-login');


});





// app.get('/dashboard/waiter',authenticate.verifyToken, (req,res) => {
//     res.render('dashboard', {});
// });



const server = app.listen('3000',() => {
    console.log('Server started on port 3000.');
});
const io = require('socket.io')(server);

io.on('connection', (socket) => {

    console.log('Live kitchen started!');
  
    socket.on('alert kitchen', (msg) => {
      io.sockets.emit('new order added', msg);
    });
    socket.on('status changed', (msg) => {
        io.sockets.emit('alert waiter', msg);
    });
  
    socket.on('disconnect', () => {
        console.log('Kitchen closed!');
    });
  
  });