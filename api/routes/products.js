//Version 0.7
const express = require('express');
const router = express.Router();
const ScreenLogic = require('node-screenlogic');

//Parse Pentair Config File
const fs = require("fs");
const obj = fs.readFileSync("api/config/config.json");
const pentairConfig = JSON.parse(obj);

//Setting Global Variables
//var connectTest = {
//  result: null
//}
//var connectInfo = {
//  ipAddr: null,
//  port: null
//}


//var resultPass = 1;

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
    let slIp = 'pentairConfig.userArray[' + configId + '].slIp';
    let slPort = 'pentairConfig.userArray[' + configId + '].slPort';
    let uqry = eval(uid);
    let pqry = eval(pid);
    let unitIp = eval(slIp);
    let unitPort = eval(slPort);    
    let systemName = uqry;
    let uipAddress = unitIp;
    let pssysid = 'pentairConfig.userArray[' + configId + '].psSysID';
    let psSysId = eval(pssysid);
    let uPort = unitPort; 
    let systemNameFull = 'Pentair: ' + systemName;
    let password = pqry;
    connect(new ScreenLogic.UnitConnection(uPort, uipAddress));



    // Get Data From Pentair
    function connect(client) {
      client.on('loggedIn', function(unit) {
        //node-ScreenLogic Meathod to query Interface
        this.getVersion();
      }).on('version', function(version) {
        let slVersion = version.version
        //Format Responce
        res.status(200).json({
          results : 
            [
              {
                id : systemName,
                version : slVersion,
                ip : uipAddress,
                port : uPort,
                ps_sysid : psSysId,
            }]
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
      this.getPoolStatus();
    }).on('poolStatus', function(status) {
//      let slVersion = version.version
      //Format Responce
      res.status(200).json({
        id: systemName,
        statusOk: status.ok,
        active: status.isPoolActive(),
        heatMode: status.heatMode[0],
        heatStatus: status.heatStatus[0],
        tempSetPoint: status.setPoint[0],
        airTemp: status.airTemp,
        waterTemp: status.currentTemp[0],
        saltPpm: status.saltPPM,
        pH: status.pH,
        pHTankLevel: status.pHTank,
        orp: status.orp,
        orpTankLevel: status.orpTank,
        saturation: status.saturation,
//        circuitArray: status.circuitArray
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
      this.getPoolStatus();
    }).on('poolStatus', function(status) {
//      let slVersion = version.version
      //Format Responce
      res.status(200).json({
        id: systemName,
        statusOk: status.ok,
        active: status.isSpaActive(),
        heatMode: status.heatMode[1],
        heatStatus: status.heatStatus[1],
        tempSetPoint: status.setPoint[1],
        airTemp: status.airTemp,
        waterTemp: status.currentTemp[1],
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