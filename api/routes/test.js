const express = require('express');
const router = express.Router();
const ScreenLogic = require('node-screenlogic');

//Parse Pentair Config File
const fs = require("fs");
const obj = fs.readFileSync("api/config/config.json");
const pentairConfig = JSON.parse(obj);


//Handel Requests for Test
router.get('/', (req, res, next) => {
    res.status(200).json({
      message: 'Handling GET Request to / Test'
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
    //Connect to ScreenLogic
    let remote = new ScreenLogic.RemoteLogin(systemNameFull);
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
    // Get Data From Pentair
    function connect(client) {
      client.on('loggedIn', function() {
        this.getVersion();
      }).on('version', function(version) {
        //Format Responce
        res.status(200).json({
          message: systemNameFull,
          varsion: varsion.varsion
        });
        client.close();
      });
      client.connect();
    }
  });
















module.exports = router;