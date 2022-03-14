#!/bin/bash

# Variables
SECONDS=0
PUSH_PATH="/usr/lib/node_modules/node-screenlogic-rest/api/posts/"
CIR="push-circuit.js"
TEMPSTAT="push-tempstat.js"
PUMPSTAT="push-pump.js"


#Temp Status Monitoring
node $PUSH_PATH$TEMPSTAT space
node $PUSH_PATH$TEMPSTAT heater
node $PUSH_PATH$TEMPSTAT pool
node $PUSH_PATH$TEMPSTAT spa

#Circuit Monitoring
#node $PUSH_PATH$CIR 0
#node $PUSH_PATH$CIR 1
#node $PUSH_PATH$CIR 2
#node $PUSH_PATH$CIR 3
#node $PUSH_PATH$CIR 4
#node $PUSH_PATH$CIR 5
#node $PUSH_PATH$CIR 6
#node $PUSH_PATH$CIR 7
#node $PUSH_PATH$CIR 8
#node $PUSH_PATH$CIR 9
#node $PUSH_PATH$CIR 10
#node $PUSH_PATH$CIR 11
#node $PUSH_PATH$CIR 12
#node $PUSH_PATH$CIR 13
#node $PUSH_PATH$CIR 14
#node $PUSH_PATH$CIR 15
#node $PUSH_PATH$CIR 16
#node $PUSH_PATH$CIR 17
#Chemical Readings


#Pump Status Monitoring
#node $PUSH_PATH$PUMPSTAT

#Log Stop
duration=$SECONDS
echo "SLPUSH END | $(($duration / 60)) Minutes and $(($duration % 60)) Seconds"

