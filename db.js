var mongoClient = require("mongodb").MongoClient;

var serverToken = "mongodb://misgodb:GwNamb5d3EBN6JX3agh5gNl0DHcMqZoe2s5G4OEpAhEDVrTxVnouvqsiVFIihoFdllSi44FcJUCkmzoqCQoofw==@misgodb.documents.azure.com:10250/?ssl=true";

function connection() {
	mongoClient.connect(serverToken, function(err, db) {
		if (err) throw err;
		return db;
	});
}

module.exports = {
	connectionTest: function() {
		mongoClient.connect(serverToken, function(err, db) {
			if (err) throw err;
			console.log(db);
			db.close();
		});
	},

	insertBinding: function(UID, STM32_ID, motorcycle) {
		var db = connection();
		db.collection('una').insertOne({
			"STM32_ID": STM32_ID,
			"motorcycle": motorcycle,
			"UID": UID
		}, function(err, result) {
			console.log("new UID : " + UID);
		});
	}
};
