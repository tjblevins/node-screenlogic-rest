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
        message: 'Handling GET Request to / Config'
    });
});

// ScreenLogic Query Functions
// generic connection method used by all above examples
let slVer;
function connect(client) {
    client.on('loggedIn', function() {
      this.getControllerConfig();
    }).on('controllerConfig', function(controller) {
      //Route to handler for Controller Config API
      router.get('/:prodId/controller', (req, res, next) => {
        const id = req.params.prodId;
        if (id === systemName) {
          res.status(200).json({
            id: id,
            controllerId: controller.controllerId,
            controllerType: controller.controllerType,
            hasSolar: controller.hasSolar(),
            hasSolarAsHeatpump: controller.hasSolarAsHeatpump(),
            hasChlorinator: controller.hasChlorinator(),
            hasCooling: controller.hasCooling(),
            hasIntellichem: controller.hasIntellichem(),
            hwType: controller.hwType,
//            controllerData: controller.controllerData,
            equipFlags: controller.equipFlags,
            genCircuitName: controller.genCircuitName,
            bodyArray: controller.bodyArray,
            pumpCircArray: controller.pumpCircArray,
//            interfaceTabFlags: controller.interfaceTabFlags,
            showAlarms: controller.showAlarms
          });
        } else {
          res.status(200).json({
            id: id,
            message: 'You passed an incorrect ID'
          });
        }
      });
      this.getSaltCellConfig();
//      client.close();
    }).on('saltCellConfig', function(saltCell) {
      //Route to handler for SaltCell Config API
      router.get('/:prodId/saltcell', (req, res, next) => {
        const id = req.params.prodId;
        if (id === systemName) {
          res.status(200).json({
            id: id,
            installed: saltCell.installed,
            status: saltCell.status,
            poolOutput: saltCell.level1,
            spaOutput: saltCell.level2,
            saltPpm: saltCell.salt,
            flags: saltCell.flags,
            superChlorTimer: saltCell.superChlorTimer
          });
        } else {
          res.status(200).json({
            id: id,
            message: 'You passed an incorrect ID'
          });
        }
      });
//    this.getSaltCellConfig();
      client.close();


    }).on('loginFailed', function() {
      client.close();
    });
    client.connect();
  }


module.exports = router;