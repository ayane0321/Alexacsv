'use strict';
const Alexa = require("alexa-sdk-v1adapter");
const csvSync = require('csv-parse/lib/sync'); // requiring sync module
const file = 'H30.7.csv';
const fs = require('fs');
let data = fs.readFileSync(file);
let res = csvSync(data);

const makePlainText = Alexa.utils.TextUtils.makePlainText;  //テキストの生成
const makeImage = Alexa.utils.ImageUtils.makeImage; //画像の生成

//インテントハンドラーを登録します。今回は名前を覚えている状態のセッションが必要なので２つハンドラを登録します。
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = process.env.ALEXA_APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//ハンドラの実装です。こちらが通常状態のハンドラです。
const handlers = {
    //起動時に呼ばれます。
    'LaunchRequest': function () {
        if(supportsDisplay.call(this)){
            
            let item1 = makeImage('https://s3-ap-northeast-1.amazonaws.com/asahilead/owariasahi_second.jpg', 400, 480);
            let item2 = makeImage('https://s3-ap-northeast-1.amazonaws.com/asahilead/owariasahi_third.jpg', 400, 480);
            let item3 = makeImage('https://s3-ap-northeast-1.amazonaws.com/asahilead/owariasahi_whole.jpg', 400, 480);
            const builder = new Alexa.templateBuilders.BodyTemplate1Builder();
            const template = builder.setVackgroundImage(item1).build();
            this.response.speak("こんにちは。行きたい課の名前か、知りたいことを教えてください。")
                .renderTemplate(template)
                .listen("知りたいことを教えてください．");
            this.emit(':responseReady');
        }else{
            this.emit(':ask', "こんにちは。行きたい課の名前か、知りたいことを教えてください。");
        } 
           // const textcontent = new Alexa.RichTextContentHelper()
             //   .withPrimaryText('<font size="5">',message)
               // .getTextContent();

            //const token = 'TOKEN';
            //return handlerInput.responseBuilder
              //  .speak(message)
               // .addRenderTemplateDirective({
                 //   type: '受付案内',
                  //  backButton: 'VISIBLE',
                  //  backgroundImage: backgroundImage,
                   // title :title,
                    //textContent: textContent,
                    //token : token,
               // })
               // .getResponse();

            //const listItems = listItemBuilder.build();
            //const listTemplate = listTemplateBuilder.setToken('listToken')
                //.setTitle('窓口案内')
                //.setListItems(listItems)
                //.build();
        'testIntent':function () {
        var message = "処理が先に終わっちゃったよ。";
            var log_message = "";
            if (!this.event.request.intent.slots.qs.value && !this.event.request.intent.slots.dep.value) {
                message = '発音が聞き取れませんでした。もう一度お願いします。';
                console.log("発話ミス");
                this.emit(':ask', message);
           }else if (this.event.request.intent.slots.qs.value !== null || this.event.request.intent.slots.dep.value !== null) {
                 for (var r = 2; r < res.length; r++) {
                     if (res[r][5].indexOf(this.event.request.intent.slots.qs.value) > -1 || res[r][8].indexOf(this.event.request.intent.slots.dep.value) >-1) {
                        if (res[r][5].indexOf(this.event.request.intent.slots.qs.value) > -1) {
                              if(isNaN(res[r][9])){
                                message = res[r][5] + "については" + res[r][12];
                             }else{
                                 message = res[r][5] + "については" + res[r][12] + "窓口は" + res[r][9] + "番です。";
                             }
                         } else {
                              if(isNaN(res[r][9])){
                                message = res[r][8] + "については" + res[r][12];
                             }else{
                                message = res[r][8] + "については" + res[r][12] + "窓口は" + res[r][9] + "番です。";
                             }
                        }
                           log_message = "対応済み用語:" + value_exist(this.event.request.intent.slots.qs.value, this.event.request.intent.slots.dep.value);
                            break;
                    }else if (this.event.request.intent.slots.dep.value == null) {
                        message = this.event.request.intent.slots.qs.value + "については該当するものがありませんでした。";
                        log_message = "非対応用語:" + value_exist(this.event.request.intent.slots.qs.value, this.event.request.intent.slots.dep.value);
                    }else if (this.event.request.intent.slots.qs.value == null) {
                        message = this.event.request.intent.slots.dep.value + "については該当するものがありませんでした。";
                        log_message = "非対応用語:" + value_exist(this.event.request.intent.slots.qs.value, this.event.request.intent.slots.dep.value);
                    }
                 } 
             }
             console.log(log_message);
            //this.emit(':responseReady', message + "もう一度聞きたい場合はそのまま質問を続けてください。終わる場合はバイバイと言ってください。");
            }
        }
//以下は既定のハンドラです。今回は特に触れません。
'AMAZON.HelpIntent': function () {
    const speechOutput = 'このスキルは、ひたすら垂れ流します。';
    this.response.speak(speechOutput);
    this.emit(':responseReady');
}
'AMAZON.CancelIntent': function () {
    this.response.speak('さようなら!');
    this.emit(':responseReady');
}
'AMAZON.StopIntent': function () {
    this.response.speak('また今度ね!');
    this.emit(':responseReady');
}
'Unhandled': function () {
    this.emit(':ask', 'すみません．もう一度お願いいたします．');
}
};


function value_exist(value1, value2) {
    if (value1 == undefined) {
        return value2;
    } else if (value2 == undefined) {
        return value1;
    }
};

function supportsDisplay() {
    var hasDisplay =
        this.event.context &&
        this.event.context.System &&
        this.event.context.System.device &&
        this.event.context.System.device.supportedInterfaces &&
        this.event.context.System.device.supportedInterfaces.Display
    return hasDisplay;
}
