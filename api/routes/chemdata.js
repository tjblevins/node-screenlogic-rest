//Version 0.7
const express = require('express');
const router = express.Router();
const ScreenLogic = require('node-screenlogic');

//Parse Pentair Config File
const fs = require("fs");
const obj = fs.readFileSync("/usr/lib/node_modules/node-screenlogic-rest/api/config/config.json");
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