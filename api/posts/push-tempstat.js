'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');
const ScreenLogic = require('../../node_modules/node-screenlogic/index');
const process = require('process');
var feature = process.argv[2];

//const psarg = 1;
//console.log(`arrayId: ${feature}`)

//Parse Pentair Config File(s)
const fs = require("fs");
const obj = fs.readFileSync("/usr/lib/node_modules/node-screenlogic-rest/api/config/config.json");
const pentairConfig = JSON.parse(obj);
const uid = pentairConfig.userArray[0].slID;
const pid = pentairConfig.userArray[0].slPass;
const slIp = pentairConfig.userArray[0].slIp;
const slPort = pentairConfig.userArray[0].slPort;

//Parse MID Server Config File
const sn = fs.readFileSync("/usr/lib/node_modules/node-screenlogic-rest/api/config/snconfig.json");
const snConfig = JSON.parse(sn);
const apiUser = snConfig.apiUser;
const apiPass = snConfig.apiPass;
const midSysId = snConfig.midSysId;

//Build Endpoint URL from MID Config
var postURL = "https://" + snConfig.host + snConfig.apiPathTempStat + feature;

//DEBUG
//Used for testing POST Payload
//var postURL = "https://ptsv2.com/t/gbsjl-1611577847/post";

connect(new ScreenLogic.UnitConnection(slPort, slIp));

function connect(client){
    client.on('loggedIn', function(unit) {
// Controller and Circuit Status
      this.getPoolStatus();
    }).on('poolStatus', function(status) {

        var payLoad = {
            id : uid,
            featureName: feature,
            midSysId : midSysId,
            poolActive : status.isPoolActive(),
            spaActive : status.isSpaActive(),
            freezeMode : status.freezeMode,
            airTemp : status.airTemp,
            poolTemp : status.currentTemp[0],
            poolTempSetPoint : status.setPoint[0],
            poolHeatStatus : status.heatStatus[0],
            poolHeatMode : status.heatMode[0],
            spaTemp : status.currentTemp[1],
            spaTempSetPoint : status.setPoint[1],
            spaHeatStatus : status.heatStatus[1],
            spaHeatMode : status.heatMode[1]
            }


// Using Axios to forward POST
        axios
//        .post(postURL, payLoad)
        .post(postURL, payLoad, {
          auth: {
            username: apiUser,
            password: apiPass
          }
        })
        .then(res => {
        //console.log(`statusCode: ${res.status}`)
        //console.log(res)
        })
        .catch(error => {
        console.error(error)
        })

        client.close();
    });
    
    client.connect();

}







