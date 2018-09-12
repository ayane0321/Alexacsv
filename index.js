'use strict';
const Alexa = require("alexa-sdk");
const csvSync = require('csv-parse/lib/sync'); 
const file = 'study.csv';
const fs = require('fs');
let data = fs.readFileSync(file);
let res = csvSync(data);

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context,callback);
    alexa.appId = process.env.ALEXA_APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    //起動時に呼ばれます。
    'LaunchRequest': function () {
        this.emit('SayHello');
    },
    'SayHello': function () {
        var message =res[0][0];
        this.emit(':tell',message);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'CSVを流すスキルです。';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('さようなら!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('また今度ね!');
        this.emit(':responseReady');
    }
};
