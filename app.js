var db = require('./db.js');
db.connectionTest();

var converter = require('hex2dec');
var linebot = require('linebot');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var myuserid = "U362136ce7ef87de62bae7b85de8b5d7f";
var mygroupid = "C4d91d7abc6676f42ef922d2cf1378f7a";

var type = 'init';
var STM32_ID = "";
var motorcycle = "";

var carNumber = 'mis-666';
var lat = 25.040302, lng = 121.5387707;

var isNearby = false;

var bot = linebot({
    channelId: "1483029082",
    channelSecret: "ada6218baf7780aea777e87de0b5c093",
    channelAccessToken: "HgmqnvzXuSTtXjB/3yiI0TRFOD2JWImFRFhHavnhGvBLfTeDzBdEREYYWb+oT8zsTfxIBvP4JHHT8kQP853zcJ870pGvKDyKc+zi4cd3ebkitUY8xUa9dkFpIjDjvdNXO5AfquvILjUZ2FLxSluXrwdB04t89/1O/w1cDnyilFU="
});

io.on('connection', function(client){ console.log('a connection'); });

app.use(express.static('www'));

app.get('/sigfox', function(req, res) {
	var data = req.query.data;
	var name = '陳銘嘉';
	//bot.push(myuserid, data);
	switch (data) {
		case "01":
			break;
		case "02":
			if (isNearby) {
				bot.push(mygroupid, {
						type: 'sticker',
						packageId: 1,
						stickerId: 3
				}, {
					type: 'text',
					text: name + "在騎車時摔倒了!"
				}, {
						type: 'location',
						title: '事發地點',
						address: '點我查看地圖',
						latitude: lat,
						longitude: lng
				});
			} else {
				bot.push(myuserid, {
						type: 'sticker',
						packageId: 1,
						stickerId: 135
				});
				bot.push(myuserid, "你的車(" + carNumber + ")翻倒了!");
			}
			break;
		case "03":
			bot.push(myuserid, [
					{
						type: 'sticker',
						packageId: 2,
						stickerId: 174
					}, {
						type: 'text', 
						text: name + "發生車禍了!"
					}, {
						type: 'location',
						title: '事發地點',
						address: '點我查看地圖',
						latitude: lat,
						longitude: lng
					}]);
			break;
		case "04":
			if (!isNearby) {
				io.emit('play:alarm', '');
				
				bot.push(myuserid, [
					{
						type: 'sticker',
						packageId: 1,
						stickerId: 113
					}, { 
						type: 'text', 
						text: "你的車(" + carNumber + ")正在移動!趕快去看看!"
					}
				]);
				bot.push(myuserid, {
						type: 'template',
						altText: '停止警報',
						template: {
							type: 'confirm',
							text: '停止警報聲?',
							actions: [{
								type: 'postback',
								label: 'Yes',
								data: 'alarm_stop'
							}, {
								type: 'postback',
								label: 'No',
								data: 'alarm_continue'
							}]
						}
					});
			}
			break;
	}
	//lat = req.query.lat;
	//lng = req.query.lng;
	
	res.end();
});

bot.on('message', function (event) {
	if (event.source.userId != myuserid) {
		event.reply("請綁定您的裝置");
		return;
	}
    switch (event.message.type) {
        case 'text':
			switch (type) {
				case 'init':
					switch (event.message.text) {
						case 'register':
							event.reply('請輸入裝置編號：');
							type = 'enterSTM32_ID';
							break;
						case 'lock':
							isNearby = false;
							io.emit('play:lock', '');
							event.reply('已上鎖');
							break;
						case 'unlock':
							isNearby = true;
							io.emit('play:unlock', '');
							event.reply('已解鎖');
							break;
						case 'find':
							event.reply({
								type: 'location',
								title: '尋車結果',
								address: '點我查看地圖',
								latitude: lat,
								longitude: lng
							});
							break;
					}
					break;
				case 'enterSTM32_ID':
					STM32_ID = event.message.text;
					type = 'enterCarNumber';
					event.reply('請輸入車牌號碼：');
					break;
				case 'enterCarNumber':
					motorcycle = event.message.text;
					type = 'confirmRegisterInfo';
					event.reply({
						type: 'template',
						altText: '請用手機確認內容',
						template: {
							type: 'confirm',
							text: '編號：' + STM32_ID + '\r\n車牌：' + motorcycle + '\r\n資料是否正確？',
							actions: [{
								type: 'postback',
								label: 'Yes',
								data: 'regist_yes'
							}, {
								type: 'postback',
								label: 'No',
								data: 'regist_no'
							}]
						}
					});
					break;
			}
    }
});

bot.on('postback', function(event) {
	if (event.source.userId != myuserid) {
		event.reply("請綁定您的裝置");
		return;
	}
	if (event.postback.data == 'alarm_stop') {
		io.emit('stop:alarm', '');
	} else if (type == 'confirmRegisterInfo') {
        if (event.postback.data == 'regist_yes') {
			event.reply('裝置已綁定');
            db.insertBinding(event.source.userId,STM32_ID,motorcycle);
        } else if (event.postback.data == 'regist_no') {
			event.reply('已取消');
		}
        STM32_ID = "";
        motorcycle = "";
        type = 'init';
    }
});

/*
bot.on('beacon', function (event) {
	if (event.beacon.type == 'enter') {
		isNearby = true;
		bot.push(myuserid, "車輛已解鎖!");
	} else if (event.beacon.type == 'leave') {
		isNearby = false;
		bot.push(myuserid, "車輛已上鎖!");
	}
});
*/

bot.on('leave', function(event) {
	bot.push(myuserid, event.source.groupId);
});
bot.on('join', function(event) {
	bot.push(myuserid, event.source.groupId);
});
const linebotParser = bot.parser();
app.post('/webhook', linebotParser);

server.listen(process.env.PORT || 3000, function () {
    console.log('App server is listening!');
});
