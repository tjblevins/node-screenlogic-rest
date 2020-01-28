const express = require('express');
const router = express.Router();
const ScreenLogic = require('node-screenlogic');

//Parse Pentair Config File
var fs = require("fs");
var obj = fs.readFileSync("api/config/pentairConfig.json");
var pentairConfig = JSON.parse(obj);

//ScreenLogic Connection

const systemName = pentairConfig.env.slID;
const systemNameFull = 'Pentair: ' + systemName;
const password = pentairConfig.env.slPass;

var remote = new ScreenLogic.RemoteLogin(systemNameFull);
remote.on('gatewayFound', function(unit) {
  remote.close();
  if (unit && unit.gatewayFound) {
    console.log('unit ' + remote.systemName + ' found at ' + unit.ipAddr + ':' + unit.port);
    connect(new ScreenLogic.UnitConnection(unit.port, unit.ipAddr, password));
  } else {
    console.log('no unit found by that name');
  }
});

remote.connect();

//Handel Requests for Products
router.get('/', (req, res, next) => {
      res.status(200).json({
        message: 'Handling GET Request to / ChemData'
    });
});

// ScreenLogic Query Functions
// generic connection method used by all above examples
let slVer;
function connect(client) {
    client.on('loggedIn', function() {
      this.getChemicalData();
    }).on('chemicalData', function(chemData) {
      //Route to handler for ChemData Status
      router.get('/:prodId/status/', (req, res, next) => {
        const id = req.params.prodId;
        if (id === systemName) {
          res.status(200).json({
            id: id,
            isValid: chemData.isValid
          });
        } else {
          res.status(200).json({
            id: id,
            message: 'You passed an incorrect ID'
          });
        }
      });
      //Route to handler for ChemData PH
      router.get('/:prodId/status/ph', (req, res, next) => {
        const id = req.params.prodId;
        if (id === systemName) {
          res.status(200).json({
            id: id,
            pH: chemData.pH
          });
        } else {
          res.status(200).json({
            id: id,
            message: 'You passed an incorrect ID'
          });
        }
      });
      client.close();
    }).on('loginFailed', function() {
      client.close();
    });
    client.connect();
  }


module.exports = router;