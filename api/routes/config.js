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
    let slIp = 'pentairConfig.userArray[' + configId + '].slIp';
    let slPort = 'pentairConfig.userArray[' + configId + '].slPort';
    let uqry = eval(uid);
    let pqry = eval(pid);
    let unitIp = eval(slIp);
    let unitPort = eval(slPort);    
    let systemName = uqry;
    let uipAddress = unitIp;
    let uPort = unitPort; 
    let systemNameFull = 'Pentair: ' + systemName;
    let password = pqry;
    connect(new ScreenLogic.UnitConnection(uPort, uipAddress));


    //Test and Set Connection Parameters to ScreenLogic
//    let remote = new ScreenLogic.RemoteLogin(systemNameFull);
//    remote.on('gatewayFound', function(unit) {
//      remote.close();
//      if (unit && unit.gatewayFound) {
//        var connectResult = 1;
//        connectTest.result = connectResult;
//        connectInfo.ipAddr = unit.ipAddr;
//        connectInfo.port = unit.port;
//        console.log('unit ' + remote.systemName + ' found at ' + unit.ipAddr + ':' + unit.port);
//        connect(new ScreenLogic.UnitConnection(unit.port, unit.ipAddr, password));
//      } else {
//        console.log('no unit found by that name');
//      }
//    });
//    remote.connect();

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

//Route to handler for Circuit Config API
router.get('/:configId/controller/circuit/:arrayId', (req, res, next) => {
    //Parse URL Req for User an Pass for ScreenLogic Controller
    let configId = req.params.configId
    let uid = 'pentairConfig.userArray[' + configId + '].slID';
    let pid = 'pentairConfig.userArray[' + configId + '].slPass';
    let slIp = 'pentairConfig.userArray[' + configId + '].slIp';
    let slPort = 'pentairConfig.userArray[' + configId + '].slPort';
    let uqry = eval(uid);
    let pqry = eval(pid);
    let unitIp = eval(slIp);
    let unitPort = eval(slPort);    
    let systemName = uqry;
    let uipAddress = unitIp;
    let uPort = unitPort; 
    let systemNameFull = 'Pentair: ' + systemName;
    let password = pqry;
    connect(new ScreenLogic.UnitConnection(uPort, uipAddress));


    //Test and Set Connection Parameters to ScreenLogic
//    let remote = new ScreenLogic.RemoteLogin(systemNameFull);
//    remote.on('gatewayFound', function(unit) {
//      remote.close();
//      if (unit && unit.gatewayFound) {
//        var connectResult = 1;
//        connectTest.result = connectResult;
//        connectInfo.ipAddr = unit.ipAddr;
//        connectInfo.port = unit.port;
//        console.log('unit ' + remote.systemName + ' found at ' + unit.ipAddr + ':' + unit.port);
//        connect(new ScreenLogic.UnitConnection(unit.port, unit.ipAddr, password));
//      } else {
//        console.log('no unit found by that name');
//      }
//    });
//    remote.connect();

  // Get Data From Pentair
  function connect(client) {
    client.on('loggedIn', function(unit) {
      //node-ScreenLogic Meathod to query Interface
      this.getControllerConfig();
    }).on('controllerConfig', function(controller) {
//        let slVersion = version.version
      let arrayId = req.params.arrayId;
      let aid = 'controller.bodyArray[' + arrayId + ']';
      let circuit = eval(aid);
      //Format Responce
      res.status(200).json({
          id: systemName,
          controllerId: controller.controllerId,
          circuitId: circuit.circuitId,
          name: circuit.name,
          nameIndex: circuit.nameIndex,
          function: circuit.function,
          interface: circuit.interface,
          flags: circuit.flags,
          colorSet: circuit.colorSet,
          colorPos: circuit.colorPos,
          colorStagger: circuit.colorStagger,
          deviceId: circuit.deviceId,
          dfaultRt: circuit.dfaultRt
          });   
      client.close();
    });
    client.connect();
  }
});

//Route to handler for Circuit Status API
router.get('/:configId/controller/circuit/:arrayId/status', (req, res, next) => {
    //Parse URL Req for User an Pass for ScreenLogic Controller
    let configId = req.params.configId
    let uid = 'pentairConfig.userArray[' + configId + '].slID';
    let pid = 'pentairConfig.userArray[' + configId + '].slPass';
    let slIp = 'pentairConfig.userArray[' + configId + '].slIp';
    let slPort = 'pentairConfig.userArray[' + configId + '].slPort';
    let uqry = eval(uid);
    let pqry = eval(pid);
    let unitIp = eval(slIp);
    let unitPort = eval(slPort);    
    let systemName = uqry;
    let uipAddress = unitIp;
    let uPort = unitPort; 
    let systemNameFull = 'Pentair: ' + systemName;
    let password = pqry;
    connect(new ScreenLogic.UnitConnection(uPort, uipAddress));


    //Test and Set Connection Parameters to ScreenLogic
//    let remote = new ScreenLogic.RemoteLogin(systemNameFull);
//    remote.on('gatewayFound', function(unit) {
//      remote.close();
//      if (unit && unit.gatewayFound) {
//        var connectResult = 1;
//        connectTest.result = connectResult;
//        connectInfo.ipAddr = unit.ipAddr;
//        connectInfo.port = unit.port;
//        console.log('unit ' + remote.systemName + ' found at ' + unit.ipAddr + ':' + unit.port);
//        connect(new ScreenLogic.UnitConnection(unit.port, unit.ipAddr, password));
//      } else {
//        console.log('no unit found by that name');
//      }
//    });
//    remote.connect();

  // Get Data From Pentair
  function connect(client) {
    client.on('loggedIn', function(unit) {
      //node-ScreenLogic Meathod to query Interface
      this.getPoolStatus();
    }).on('poolStatus', function(status) {
//        let slVersion = version.version
      let arrayId = req.params.arrayId;
      let aid = 'status.circuitArray[' + arrayId + ']';
      let circuit = eval(aid);
      //Format Responce
      res.status(200).json({
          id: systemName,
          circuitId: circuit.id,
          state: circuit.state,
          colorSet: circuit.colorSet,
          colorPos: circuit.colorPos,
          colorStagger: circuit.colorStagger,
          delay: circuit.delay
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
    let slIp = 'pentairConfig.userArray[' + configId + '].slIp';
    let slPort = 'pentairConfig.userArray[' + configId + '].slPort';
    let uqry = eval(uid);
    let pqry = eval(pid);
    let unitIp = eval(slIp);
    let unitPort = eval(slPort);    
    let systemName = uqry;
    let uipAddress = unitIp;
    let uPort = unitPort; 
    let systemNameFull = 'Pentair: ' + systemName;
    let password = pqry;
    connect(new ScreenLogic.UnitConnection(uPort, uipAddress));

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


//Route to handler for SaltCellOutput
router.post('/:configId/saltcell/output', (req, res, next) => {
  //Parse pentairConfig for User an Pass for ScreenLogic Controller
  let configId = req.params.configId
  let uid = 'pentairConfig.userArray[' + configId + '].slID';
  let pid = 'pentairConfig.userArray[' + configId + '].slPass';
  let slIp = 'pentairConfig.userArray[' + configId + '].slIp';
  let slPort = 'pentairConfig.userArray[' + configId + '].slPort';
  let uqry = eval(uid);
  let pqry = eval(pid);
  let unitIp = eval(slIp);
  let unitPort = eval(slPort);    
  let systemName = uqry;
  let uipAddress = unitIp;
  let uPort = unitPort; 
  let systemNameFull = 'Pentair: ' + systemName;
  let password = pqry;
  // JSON Body of POST used to update SaltCell
  let info = {
    controllerId: req.body.controllerId,
    poolOutput: req.body.poolOutput,
    spaOutput: req.body.spaOutput
//      controllerId: 0,
//      poolOutput: 75,
//      spaOutput: 0
  };

  connect(new ScreenLogic.UnitConnection(uPort, uipAddress));

    // Get Data From Pentair
    function connect(client) {
      client.on('loggedIn', function(unit) {
        //node-ScreenLogic Meathod to query Interface
        this.setSaltCellOutput(info.controllerId,info.poolOutput,info.spaOutput);
        this.getSaltCellConfig();
      }).on('saltCellConfig', function(saltCell) {
//        let slVersion = version.version
        //Format Responce
        res.status(200).json({
            message: 'Set SaltCell Output',
            setOutput: info
            });   
        client.close();
      });
      client.connect();
    }
});











module.exports = router;