var authenticationDb;
var authMongoClient = require('mongodb').MongoClient;

exports.connect = function(connString, callback){
	authMongoClient.connect(connString, function(err, db) {
		if(err) {
			console.log("<MongoAuthentication> MongoDB connection error: " + err.msg);
		}else {
			console.log("<MongoAuthentication> Successfully connected to your MongoDB database!");
			authenticationDb = db;
			callback();
		}
	});
}

exports.test = function(){
	if(authenticationDb) {
		console.log("MongoAuth is running!!! :)");
	}
}