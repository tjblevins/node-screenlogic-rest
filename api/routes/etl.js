//Version 0.7
const express = require('express');
const router = express.Router();
const ScreenLogic = require('node-screenlogic');

//Parse Pentair Config File
const fs = require("fs");
const { version } = require('os');
const obj = fs.readFileSync("api/config/config.json");
const pentairConfig = JSON.parse(obj);

//Parse ServiceNow Config File
const snConfigFile = fs.readFileSync("api/config/snconfig.json");
const snConfig = JSON.parse(snConfigFile);

//Parse Gateway Config File
const gwConfigFile = fs.readFileSync("api/config/gwconfig.json");
const gwConfig = JSON.parse(gwConfigFile);

//Setting Global Variables
var connectTest = {
  result: null
}
var resultPass = 1;
var ver;

//Handel Requests for Config
router.get('/', (req, res, next) => {
    res.status(200).json({
      message: 'Handling GET Request to / Config'
  });
});

//Route to handler for Controller Config API
router.get('/:configId/', (req, res, next) => {
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
    let ps_sysid = snConfig.ps_sysid;
    let company_sysid = snConfig.company_sysid;
    let uVersion = gwConfig.results[0].version;
    let sl_api_ip = gwConfig.results[0].sl_api_ip;
    let sl_api_port = gwConfig.results[0].sl_api_port;

    let systemNameFull = 'Pentair: ' + systemName;
    let password = pqry;
    var version;
    connect(new ScreenLogic.UnitConnection(uPort, uipAddress));

    // Get Data From Pentair
    function connect(client) {
      client.on('loggedIn', function(unit) {
        this.getControllerConfig();
    }).on('controllerConfig', function(controller) {
        //Format Responce
        res.status(200).json({
              gateway: [{
                id: systemName,
                version: uVersion,
                ip: uipAddress,
                port: uPort,
                sl_api_ip: sl_api_ip,
                sl_api_port: sl_api_port,
                ps_sysid: ps_sysid,
                company_sysid: company_sysid
              }],
              controller: [{
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
                ps_sysid: ps_sysid,
                company_sysid: company_sysid
              }],
              circuitArray: controller.bodyArray
          });
          client.close();
        });
        client.connect();
      }
    });







module.exports = router;