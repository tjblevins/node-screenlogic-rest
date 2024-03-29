//Version 0.6
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const ScreenLogic = require('node-screenlogic');

//Define API Routes
const productRoutes = require('/usr/lib/node_modules/node-screenlogic-rest/api/routes/products');
const configRoutes = require('/usr/lib/node_modules/node-screenlogic-rest/api/routes/config');
const chemRoutes = require('/usr/lib/node_modules/node-screenlogic-rest/api/routes/chemdata');
const testRoutes = require('/usr/lib/node_modules/node-screenlogic-rest/api/routes/test');
const etlRoutes = require('/usr/lib/node_modules/node-screenlogic-rest/api/routes/etl');

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
app.use('/config', configRoutes);
app.use('/chemdata', chemRoutes);
app.use('/test', testRoutes);
app.use('/etl', etlRoutes);

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