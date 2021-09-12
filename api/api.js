const express = require('express');
const app = express();
const path = require('path');

const mysql = require('mysql');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const authenticate = require('./authenticate');
const kitchenRoutes = require('./routes/kitchen');

//const registerRoutes = require('./api/routes/register');
const itemCategory_route = require('./routes/itemCategory');

const itemInventory_route = require('./routes/itemInventory');

const dashboard_manager_routes = require('./routes/manager_dashboard');

const employeeRoutes = require('./routes/employee');
const employeeCategoryRoutes = require('./routes/employeeCat');

const item_Supply_route = require('./routes/itemSupply');

const salaryRoutes = require('./routes/salary');

const supply_expense_routes = require('./routes/supply_expense');

const table_routes= require('./routes/tables');
// const getItems_route = require('./routes/itemInventory');

const itemCountByCategory = require('./routes/itemInventory-Category');

const userRoutes = require('./routes/user');
const supplierRoutes = require('./routes/supplier');
const supplyRoutes = require('./routes/supply');
const dishReportRoutes = require('./routes/dish-report');
const incomeRoutes = require('./routes/income');
const cookReportRoutes = require('./routes/cook-report');
const waiterLiveOrderRoutes = require('./routes/waiter-live-orders');
const customerRoutes = require('./routes/customer');

const expensesRoutes = require('./routes/expenses');

const dashboardRoutes = require('./routes/dashboard');

const reviewRoutes = require('./routes/review');

const waiterReportRoutes = require('./routes/waiter-report');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(morgan('dev'));


app.use(express.static('static_files'));
app.use('/uploads',express.static(path.join(__dirname,'/uploads')));
app.set('view engine', 'ejs');

userRoutes.use(bodyParser);
supplierRoutes.use(bodyParser);
supplyRoutes.use(bodyParser);
kitchenRoutes.use(bodyParser);
waiterReportRoutes.use(bodyParser);
dishReportRoutes.use(bodyParser);
incomeRoutes.use(bodyParser);
cookReportRoutes.use(bodyParser);
waiterLiveOrderRoutes.use(bodyParser);
customerRoutes.use(bodyParser);

app.use('/user', userRoutes);

app.use('/supplier', supplierRoutes);   // checking for token

app.use('/salary',salaryRoutes);

app.use('/supply',supplyRoutes);

app.use('/kitchen', kitchenRoutes);

app.use('/waiter-report', waiterReportRoutes);

app.use('/dish-report', dishReportRoutes);

app.use('/income', incomeRoutes);

app.use('/expenses',expensesRoutes);

app.use('/supply_expense/',supply_expense_routes);

app.use('/dashboard-manager',dashboard_manager_routes);

app.use('/cook-report', cookReportRoutes);

app.use('/waiter-live-orders', waiterLiveOrderRoutes);

app.use('/customer', customerRoutes);


const orderRoutes = require('./routes/order');
const allOrderRoutes = require('./routes/allOrders');

const dish_TypeRoutes = require('./routes/dishType');


const dishRoutes = require('./routes/dish');


const nonPaidOrderRoutes = require('./routes/nonPaidOrders');

const ingredientsRoutes = require('./routes/ingredients'); 



app.use('/item',itemInventory_route);


//app.use('/register', registerRoutes);

app.use('/itemCategories',itemCategory_route);

app.use('/uploads', express.static('uploads'));

app.use('/tables',table_routes);



app.use('/addItemSupply',item_Supply_route);



app.use('/itemFromSupply', item_Supply_route);

app.use('/employee',employeeRoutes);

app.use('/employeeCategory', employeeCategoryRoutes);

app.use('/get_itemcount_by_category',itemCountByCategory);


app.use('/order', orderRoutes);

app.use('/allOrders', allOrderRoutes);

app.use('/nonPaid', nonPaidOrderRoutes);

app.use('/dishType',dish_TypeRoutes);

app.use('/dish',dishRoutes);

app.use('/review', reviewRoutes); 

app.use('/dashboard', dashboardRoutes);

app.use('/ingredients', ingredientsRoutes);

app.use(bodyParser.urlencoded({extended:true}));

module.exports = app;


