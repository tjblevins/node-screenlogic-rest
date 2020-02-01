//Version 0.6
const express = require('express');
const router = express.Router();
const ScreenLogic = require('node-screenlogic');

//Parse Pentair Config File
const fs = require("fs");
const obj = fs.readFileSync("api/config/config.json");
const pentairConfig = JSON.parse(obj);

//Setting Global Variables
var connectTest = {
  result: null
}
var resultPass = 1;

//Handel Requests for Config
router.get('/', (req, res, next) => {
    res.status(200).json({
      message: 'Handling GET Request to / Config'
  });
});

//Route to handler for Controller Config API
router.get('/:configId/controller', (req, res, next) => {
    //Parse URL Req for User an Pass for ScreenLogic Controller
    let configId = req.params.configId
    let uid = 'pentairConfig.userArray[' + configId + '].slID';
    let pid = 'pentairConfig.userArray[' + configId + '].slPass';
    let uqry = eval(uid);
    let pqry = eval(pid);    
    let systemName = uqry;
    let systemNameFull = 'Pentair: ' + systemName;
    let password = pqry;
    //Test and Set Connection Parameters to ScreenLogic
    let remote = new ScreenLogic.RemoteLogin(systemNameFull);
    remote.on('gatewayFound', function(unit) {
      remote.close();
      if (unit && unit.gatewayFound) {
        var connectResult = 1;
        connectTest.result = connectResult;
        console.log('unit ' + remote.systemName + ' found at ' + unit.ipAddr + ':' + unit.port);
        connect(new ScreenLogic.UnitConnection(unit.port, unit.ipAddr, password));
      } else {
        console.log('no unit found by that name');
      }
    });
    remote.connect();

    // Get Data From Pentair
    function connect(client) {
      client.on('loggedIn', function(unit) {
        //node-ScreenLogic Meathod to query Interface
        this.getControllerConfig();
      }).on('controllerConfig', function(controller) {
//        let slVersion = version.version
        //Format Responce
        res.status(200).json({
            id: systemName,
            controllerId: controller.controllerId,
            controllerType: controller.controllerType,
            hasSolar: controller.hasSolar(),
            hasSolarAsHeatpump: controller.hasSolarAsHeatpump(),
            hasChlorinator: controller.hasChlorinator(),
            hasCooling: controller.hasCooling(),
            hasIntellichem: controller.hasIntellichem(),
            hwType: controller.hwType,
            equipFlags: controller.equipFlags,
            genCircuitName: controller.genCircuitName,
            bodyArray: controller.bodyArray,
            pumpCircArray: controller.pumpCircArray,
            showAlarms: controller.showAlarms
            });   
        client.close();
      });
      client.connect();
    }
});

//Route to handler for SaltCell Config API
router.get('/:configId/saltcell', (req, res, next) => {
  //Parse URL Req for User an Pass for ScreenLogic Controller
  let configId = req.params.configId
  let uid = 'pentairConfig.userArray[' + configId + '].slID';
  let pid = 'pentairConfig.userArray[' + configId + '].slPass';
  let uqry = eval(uid);
  let pqry = eval(pid);    
  let systemName = uqry;
  let systemNameFull = 'Pentair: ' + systemName;
  let password = pqry;
  //Test and Set Connection Parameters to ScreenLogic
  let remote = new ScreenLogic.RemoteLogin(systemNameFull);
  remote.on('gatewayFound', function(unit) {
    remote.close();
    if (unit && unit.gatewayFound) {
      var connectResult = 1;
      connectTest.result = connectResult;
      console.log('unit ' + remote.systemName + ' found at ' + unit.ipAddr + ':' + unit.port);
      connect(new ScreenLogic.UnitConnection(unit.port, unit.ipAddr, password));
    } else {
      console.log('no unit found by that name');
    }
  });
  remote.connect();

  // Get Data From Pentair
  function connect(client) {
    client.on('loggedIn', function(unit) {
      //node-ScreenLogic Meathod to query Interface
      this.getSaltCellConfig();
    }).on('saltCellConfig', function(saltCell) {
//        let slVersion = version.version
      //Format Responce
      res.status(200).json({
          id: systemName,
          installed: saltCell.installed,
          status: saltCell.status,
          poolOutput: saltCell.level1,
          spaOutput: saltCell.level2,
          saltPpm: saltCell.salt,
          flags: saltCell.flags,
          superChlorTimer: saltCell.superChlorTimer
          });   
      client.close();
    });
    client.connect();
  }
});











module.exports = router;