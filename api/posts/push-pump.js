'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');
const ScreenLogic = require('../../node_modules/node-screenlogic/index');
const process = require('process');
//var feature = process.argv[2];

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
var postURL = "https://" + snConfig.host + snConfig.apiPathPumpStat;

//DEBUG
//Used for testing POST Payload
//var postURL = "https://ptsv2.com/t/gbsjl-1611577847/post";

connect(new ScreenLogic.UnitConnection(slPort, slIp));

function connect(client){
    client.on('loggedIn', function(unit) {
// Controller and Circuit Status
this.getPumpStatus(0);
}).on('getPumpStatus', function(pumpStatus) {

        var payLoad = {
            id : uid,
            midSysId : midSysId,
            status : pumpStatus.isRunning,
            type : pumpStatus.pumpType,
            currentWatts : pumpStatus.pumpWatts,
            currentRpms : pumpStatus.pumpRPMs,
            currentGpms : pumpStatus.pumpGPMs,
            s0_circuitId : pumpStatus.pumpSetting[0].circuitId,
            s0_pumpSetPoint : pumpStatus.pumpSetting[0].pumpSetPoint,
            s1_circuitId : pumpStatus.pumpSetting[1].circuitId,
            s1_pumpSetPoint : pumpStatus.pumpSetting[1].pumpSetPoint,
            s2_circuitId : pumpStatus.pumpSetting[2].circuitId,
            s2_pumpSetPoint : pumpStatus.pumpSetting[2].pumpSetPoint,
            s3_circuitId : pumpStatus.pumpSetting[3].circuitId,
            s3_pumpSetPoint : pumpStatus.pumpSetting[3].pumpSetPoint,
            s4_circuitId : pumpStatus.pumpSetting[4].circuitId,
            s4_pumpSetPoint : pumpStatus.pumpSetting[4].pumpSetPoint,
            s5_circuitId : pumpStatus.pumpSetting[5].circuitId,
            s5_pumpSetPoint : pumpStatus.pumpSetting[5].pumpSetPoint,
            s6_circuitId : pumpStatus.pumpSetting[6].circuitId,
            s6_pumpSetPoint : pumpStatus.pumpSetting[6].pumpSetPoint,
            s7_circuitId : pumpStatus.pumpSetting[7].circuitId,
            s7_pumpSetPoint : pumpStatus.pumpSetting[7].pumpSetPoint
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







