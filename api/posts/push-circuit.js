'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');
const ScreenLogic = require('../../node_modules/node-screenlogic/index');
const process = require('process');
var arrayId = process.argv[2];

//const psarg = 1;
//console.log(`arrayId: ${arrayId}`)

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

//Build Endpoint URL from MID Config
var postURL = "https://" + snConfig.host + snConfig.apiPathCircuit;


connect(new ScreenLogic.UnitConnection(slPort, slIp));

function connect(client){
    client.on('loggedIn', function(unit) {
// Controller and Circuit Status
      this.getPoolStatus();
    }).on('poolStatus', function(status) {
        var cirId = 'status.circuitArray[' + arrayId + '].id';
        var cId = eval(cirId);
        var cirStat = 'status.circuitArray[' + arrayId + '].state';
        var cSt = eval(cirStat);
        var payLoad = {
            id : uid,
            circuitId : cId,
            state : cSt
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







