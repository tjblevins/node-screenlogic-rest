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

//Handel Requests for ChemData
router.get('/', (req, res, next) => {
    res.status(200).json({
      message: 'Handling GET Request to / ChemData'
  });
});

//Route to handler for ChemData
router.get('/:configId/status', (req, res, next) => {
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
        this.getChemicalData();
      }).on('chemicalData', function(chemData) {
//        let slVersion = version.version
        //Format Responce
        res.status(200).json({
            id: systemName,
            isValid: chemData.isValid,
            pH: chemData.pH,
            orp: chemData.orp,
            pHSetPoint: chemData.pHSetPoint,
            orpSetPoint: chemData.orpSetPoint,
            pHTankLevel: chemData.pHTankLevel,
            orpTankLevel: chemData.orpTankLevel,
            saturation: chemData.saturation,
            calcium: chemData.calcium,
            cyanuricAcid: chemData.cyanuricAcid,
            alkalinity: chemData.alkalinity,
            saltPPM: chemData.saltPPM,
            temperature: chemData.temperature,
            corrosive: chemData.corrosive,
            scaling: chemData.scaling,
            error: chemData.error
            });   
        client.close();
      });
      client.connect();
    }
});













module.exports = router;