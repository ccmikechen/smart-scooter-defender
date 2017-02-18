var mongoClient = require("mongodb").MongoClient;

var serverToken = "mongodb://misgodb:GwNamb5d3EBN6JX3agh5gNl0DHcMqZoe2s5G4OEpAhEDVrTxVnouvqsiVFIihoFdllSi44FcJUCkmzoqCQoofw==@misgodb.documents.azure.com:10250/?ssl=true";

module.exports = {
	connectionTest: function() {
		mongoClient.connect(serverToken, function (err, db) {
			if (err) throw err;
			console.log(db);
			db.close();
		});
	}
};
