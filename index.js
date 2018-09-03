'use strict';
const Alexa = require("alexa-sdk");
const csvSync = require('csv-parse/lib/sync'); // requiring sync module
const file = 'study.csv';
const fs = require('fs');
let data = fs.readFileSync(file);
let res = csvSync(data);

//インテントハンドラーを登録します。今回は名前を覚えている状態のセッションが必要なので２つハンドラを登録します。
exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context,callback);
    alexa.appId = process.env.ALEXA_APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//ハンドラの実装です。こちらが通常状態のハンドラです。
const handlers = {
    //起動時に呼ばれます。
    'LaunchRequest': function () {
        this.emit('SayHello');
    },
    'SayHello': function () {
        var message =res[0][0];
        this.emit(':tell',message);
    },
    //以下は既定のハンドラです。今回は特に触れません。
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'このスキルは、ひたすら垂れ流します。';
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