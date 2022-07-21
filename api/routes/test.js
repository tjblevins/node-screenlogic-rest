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

//Route to handler for SaltCellOutput
router.post('/:configId/saltcell/output', (req, res, next) => {
    //Parse URL Req for User an Pass for ScreenLogic Controller
    let configId = req.params.configId
    let info = {
      controllerId: req.body.controllerId,
      poolOutput: req.body.poolOutput,
      spaOutput: req.body.spaOutput
//      controllerId: 0,
//      poolOutput: 75,
//      spaOutput: 0
    };
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