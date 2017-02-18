var db = require('./db.js');
db.connectionTest();

var converter = require('hex2dec');
var linebot = require('linebot');
var express = require('express');
var app = express();

var friendA = "U0fe240746f7d46507e27288544317997";
var friendB = "Ua19de6cd0a498bb8013e037914ab5ae4";
var friendC = "Ua4df45e4a80fb8b9a2bdcb5383408acc";
var myuserid = "U362136ce7ef87de62bae7b85de8b5d7f";

var friends = [friendA, friendB, friendC];

var temp = "";

var bot = linebot({
    channelId: "1483029082",
    channelSecret: "ada6218baf7780aea777e87de0b5c093",
    channelAccessToken: "HgmqnvzXuSTtXjB/3yiI0TRFOD2JWImFRFhHavnhGvBLfTeDzBdEREYYWb+oT8zsTfxIBvP4JHHT8kQP853zcJ870pGvKDyKc+zi4cd3ebkitUY8xUa9dkFpIjDjvdNXO5AfquvILjUZ2FLxSluXrwdB04t89/1O/w1cDnyilFU="
});

app.get('/sigfox', function(req, res) {
	var data = req.query.data;
	switch (data) {
		case "01":
			break;
		case "02":
			bot.push(myuserid, "你的車倒了!");
			break;
		case "03":
			notifyCrash();
			break;
		case "04":
			bot.push(myuserid, "你的車正在移動!")
			break;
	}
	
	res.end();
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

bot.on('message', function (event) {
	var userId = event.source.userId;
    bot.push(userId, userId);
});

const linebotParser = bot.parser();
app.post('/webhook', linebotParser);

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening!');
});

/*********************************************************/

var notifyCrash() {
	friends.forEach(function(friend) {
		bot.push(friend, "Mike發生車禍啦Q_Q");
	});
}