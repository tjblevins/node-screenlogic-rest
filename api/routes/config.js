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
      this.getControllerConfig();
    }).on('controllerConfig', function(config) {
      //Route to handler for Controller Config API
      router.get('/:prodId/controller', (req, res, next) => {
        const id = req.params.prodId;
        if (id === systemName) {
          res.status(200).json({
            id: id,
            controllerId: config.controllerId,
            controllerType: config.controllerType,
            hasSolar: config.hasSolar(),
            hasSolarAsHeatpump: config.hasSolarAsHeatpump(),
            hasChlorinator: config.hasChlorinator(),
            hasCooling: config.hasCooling(),
            hasIntellichem: config.hasIntellichem(),
//            hwType: config.hwType,
//            controllerData: config.controllerData,
            equipFlags: config.equipFlags,
            genCircuitName: config.genCircuitName,
            bodyArray: config.bodyArray,
//            pumpCircArray: config.pumpCircArray,
//            interfaceTabFlags: config.interfaceTabFlags,
            showAlarms: config.showAlarms
          });
        } else {
          res.status(200).json({
            id: id,
            message: 'You passed an incorrect ID'
          });
        }
      });
//      this.getPoolStatus();
      client.close();
    }).on('loginFailed', function() {
      client.close();
    });
    client.connect();
  }


module.exports = router;