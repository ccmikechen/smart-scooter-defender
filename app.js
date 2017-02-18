var db = require('./db.js');
db.connectionTest();

var converter = require('hex2dec');
var linebot = require('linebot');
var express = require('express');
var app = express();


var myuserid = "U362136ce7ef87de62bae7b85de8b5d7f";

var temp = "";

var bot = linebot({
    channelId: "1483029082",
    channelSecret: "ada6218baf7780aea777e87de0b5c093",
    channelAccessToken: "HgmqnvzXuSTtXjB/3yiI0TRFOD2JWImFRFhHavnhGvBLfTeDzBdEREYYWb+oT8zsTfxIBvP4JHHT8kQP853zcJ870pGvKDyKc+zi4cd3ebkitUY8xUa9dkFpIjDjvdNXO5AfquvILjUZ2FLxSluXrwdB04t89/1O/w1cDnyilFU="
});

app.get('/sigfox', function(req, res) {
	var data = req.query.data;
	var state = "";
	switch (data) {
		case "01":
			state = "正常";
			break;
		case "02":
			state = "倒啦!";
			break;
	}
	bot.push(myuserid, state + " lng: " + req.query.lng);
	res.end();
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

bot.on('message', function (event) {
	var userId = event.source.userId;
    bot.push(userId, temp);
});

const linebotParser = bot.parser();
app.post('/webhook', linebotParser);

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening!');
});
