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
var connectInfo = {
  ipAddr: null,
  port: null
}


var resultPass = 1;

//Handel Requests for Products
router.get('/', (req, res, next) => {
    res.status(200).json({
      message: 'Handling GET Request to / Products'
  });
});

//Route to handler for Version API
router.get('/:configId/version', (req, res, next) => {
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
        connectInfo.ipAddr = unit.ipAddr;
        connectInfo.port = unit.port;
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
        this.getVersion();
      }).on('version', function(version) {
        let slVersion = version.version
        //Format Responce
        res.status(200).json({
            id: systemName,
            version: slVersion,
            ip: connectInfo.ipAddr,
            port: connectInfo.port
            });   
        client.close();
      });
      client.connect();
    }
});

//Route to handler for Pool Status
router.get('/:configId/status/pool', (req, res, next) => {
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
      this.getPoolStatus();
    }).on('poolStatus', function(status) {
//      let slVersion = version.version
      //Format Responce
      res.status(200).json({
        id: systemName,
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
      client.close();
    });
    client.connect();
  }
});

//Route to handler for Spa Status
router.get('/:configId/status/spa', (req, res, next) => {
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
      this.getPoolStatus();
    }).on('poolStatus', function(status) {
//      let slVersion = version.version
      //Format Responce
      res.status(200).json({
        id: systemName,
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
      client.close();
    });
    client.connect();
  }
});











module.exports = router;