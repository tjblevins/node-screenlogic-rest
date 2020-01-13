const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const ScreenLogic = require('node-screenlogic');

//Define API Routes
const productRoutes = require('./api/routes/products');

// Connect to Pentair ScreenLogic System
// use this to remote connect to a system by name (going through the Pentair servers)
const systemName = 'Pentair: 0B-C3-6C';
const password = '';

var remote = new ScreenLogic.RemoteLogin(systemName);
remote.on('gatewayFound', function(unit) {
   remote.close();
   if (unit && unit.gatewayFound) {
     console.log('unit ' + remote.systemName + ' found at ' + unit.ipAddr + ':' + unit.port);
     connect(new ScreenLogic.UnitConnection(unit.port, unit.ipAddr, password));
   } else {
     console.log('no unit found by that name');
   }
 });

//remote.connect();

//Used for Loging and API Body Parsing
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Manage for CORS Errors
app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes to handle requests
app.use('/products', productRoutes);

// Manage Errors
app.use((req, res, next) => {
    const error = new Error ('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;