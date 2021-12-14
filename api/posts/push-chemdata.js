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
//var postURL = "https://" + snConfig.host + snConfig.apiPathChemData;

//DEBUG
//Used for testing POST Payload
var postURL = "https://ptsv2.com/t/gbsjl-1611577847/post";

connect(new ScreenLogic.UnitConnection(slPort, slIp));

function connect(client){
    client.on('loggedIn', function(unit) {
// Controller and Circuit Status
        this.getChemicalData();
    }).on('chemicalData', function(chemData) {

        var payLoad = {
            id : uid,
            midSysId : midSysId,
            pH : chemData.pH,
            pHSetPoint : chemData.pHSetPoint,
            pHTankLevel : chemData.pHTankLevel,
            orp : chemData.orp,
            orpSetPoint : chemData.orpSetPoint,
            orpTankLevel : chemData.orpTankLevel,
            lsi : chemData.saturation,
            calcium : chemData.calcium,
            cyanuricAcid : chemData.cyanuricAcid,
            alkalinity : chemData.alkalinity,
            saltPPM : chemData.saltPPM,
            corrosive : chemData.corrosive,
            scaling : chemData.scaling
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
        console.log(`statusCode: ${res.status}`)
        //console.log(res)
        })
        .catch(error => {
        console.error(error)
        })

        client.close();
    });
    
    client.connect();

}







