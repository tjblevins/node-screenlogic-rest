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
        message: 'Handling GET Request to / Products'
    });
});

// ScreenLogic Query Functions
// generic connection method used by all above examples
let slVer;
function connect(client) {
    client.on('loggedIn', function() {
      this.getVersion();
    }).on('version', function(version) {
      //Route to handler for Version API
      router.get('/:prodId/version', (req, res, next) => {
        const id = req.params.prodId;
        if (id === systemName) {
          res.status(200).json({
            id: id,
            version: version.version
          });
        } else {
          res.status(200).json({
            id: id,
            message: 'You passed an incorrect ID'
          });
        }
      });
      this.getPoolStatus();
    }).on('poolStatus', function(status) {
      //Route to handler for Pool Status
      router.get('/:prodId/status/pool', (req, res, next) => {
        const id = req.params.prodId;
        if (id === systemName) {
          res.status(200).json({
            id: id,
            statusOk: status.ok,
            poolActive: status.isPoolActive(),
            heatMode: status.heatStatus[0],
            heatStatus: status.heatStatus[0],
            tempSetPoint: status.setPoint[0],
            airTemp: status.airTemp,
            poolTemp: status.currentTemp[0],
            saltPpm: status.saltPPM,
            pH: status.pH,
            pHTankLevel: status.pHTank,
            orp: status.orp,
            orpTankLevel: status.orpTank,
            saturation: status.saturation

          });
        } else {
          res.status(200).json({
            id: id,
            message: 'You passed an incorrect ID'
          });
        }
      });
      //Route to handler for Spa Status
      router.get('/:prodId/status/spa', (req, res, next) => {
        const id = req.params.prodId;
        if (id === systemName) {
          res.status(200).json({
            id: id,
            statusOk: status.ok,
            spaActive: status.isSpaActive(),
            heatMode: status.heatStatus[1],
            heatStatus: status.heatStatus[1],
            tempSetPoint: status.setPoint[1],
            airTemp: status.airTemp,
            spaTemp: status.currentTemp[1],
            saltPpm: status.saltPPM,
            pH: status.pH,
            pHTankLevel: status.pHTank,
            orp: status.orp,
            orpTankLevel: status.orpTank,
            saturation: status.saturation
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