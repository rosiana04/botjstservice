var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js'); // predict
const cls_model = require('./sdk/cls_model.js'); // cls

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '5017636993:AAGRE6Xl94vt-H7XdLRQiHOyUNAuj-EQVvo'
const bot = new TelegramBot(token, {polling: true});

state = 0;
// Main Menu Bot
bot.onText(/\/start/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /predict`
    );   
    state = 0;
});

// input requires i and r
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `masukan nilai i|v contohnya 9|9`
    );   
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        model.predict(
            [
                parseFloat(s[0]), // string to float
                parseFloat(s[1])
            ]
        ).then((jres1)=>{
            console.log(jres1);
            
            cls_model.classify([parseFloat(s[0]), parseFloat(s[1]), parseFloat(jres1[0]), parseFloat(jres1[1])]).then((jres2)=>{
                bot.sendMessage(
                        msg.chat.id,
                        `nilai v yang diprediksi adalah ${jres1[0]} volt`
                ); 
                bot.sendMessage(
                    msg.chat.id,
                    `nilai p yang diprediksi adalah ${jres1[1]} watt`
                ); 
                bot.sendMessage(
                        msg.chat.id,
                        `Klasifikasi Tegangan ${jres2}`
                );
                state = 0;
            })
        })
    }else{
        bot.sendMessage(
        msg.chat.id,
            `Please Click /start`
        );  
        state = 0;
    }
    console.log(msg.chat.id);
})


r.get('/test/:key', function(req, res, next){
    bot.sendMessage(
            1599833896, //msg.id
            `${req.params.key}`
    );
    res.json(req.params.key);
});


// routers
// use => ...../api/predict/10/20
r.get('/predict/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        bot.sendMessage(
                1599833896, //msg.id
                `${jres[0]}|${jres[1]}`
        ); // to telegram
        
        res.json(jres); // to pc / arduino
    })
});

// routers
// use => ...../api/classify/10/20
r.get('/classify/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        cls_model.classify(
            [
                parseFloat(req.params.i), // string to float
                parseFloat(req.params.r),
                parseFloat(jres[0]),
                parseFloat(jres[1])
            ]
        ).then((jres_)=>{
            bot.sendMessage(
                    1599833896, //msg.id
                    `${jres_}`
            ); // to telegram
            
            res.json({jres, jres_})
        })
    })
});

module.exports = r;
