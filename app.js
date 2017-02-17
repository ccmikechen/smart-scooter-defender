var linebot = require('linebot');
var express = require('express');
var app = express();

var bot = linebot({
    channelId: "1483029082",
    channelSecret: "ada6218baf7780aea777e87de0b5c093",
    channelAccessToken: "HgmqnvzXuSTtXjB/3yiI0TRFOD2JWImFRFhHavnhGvBLfTeDzBdEREYYWb+oT8zsTfxIBvP4JHHT8kQP853zcJ870pGvKDyKc+zi4cd3ebkitUY8xUa9dkFpIjDjvdNXO5AfquvILjUZ2FLxSluXrwdB04t89/1O/w1cDnyilFU="
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

bot.on('message', function (event) {
    event.reply(event.message.text).then(function (data) {
        // success 
    }).catch(function (error) {
        // error 
    });
});

const linebotParser = bot.parser();
app.post('/webhook', linebotParser);

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening!');
});
