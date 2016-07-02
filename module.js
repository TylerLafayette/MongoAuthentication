var authenticationDb, collection;
var authMongoClient = require('mongodb').MongoClient;
var sha256 = require('sha256');
var randomstring = require('randomstring');

exports.connect = function(connString, data_collection, callback){
	authMongoClient.connect(connString, function(err, db) {
		if(err) {
			console.log("<MongoAuthentication> MongoDB connection error: " + err);
		}else {
			console.log("<MongoAuthentication> Successfully connected to your MongoDB database!");
			authenticationDb = db;
			collection = authenticationDb.collection(data_collection);
			callback();
		}
	});
}

exports.register = function(data, callback) {
	var returnVar;
	if(data.username) {
			collection.find({ username: data.username  }).toArray(function(err, result) {
				if(result) {
					finish({err: "This username is already taken."});
				}else {
					ifEmail();
				}
			});
	}else {
		ifEmail();
	}
	function ifEmail() {
		collection.find({ email: data.email }).toArray(function(err ,result){
			if(result) {
				finish({err: "This email is already taken."});
			}else {
				finish();
			}
		});
	}
	function finish(data) {
		if(data.err) {
			returnVar = { err: true, msg: data.err };
		}else {
			var salt = randomstring.generate();
			var saltedPw = sha256.x2(data.password + salt);
			data.password = saltedPw;
			data.salt = salt;
			console.log(data);
			// collection.insertOne();
			returnVar = { err: false, msg: "User was successfully created." };
		}
	}
}

exports.test = function(){
	if(authenticationDb) {
		console.log("MongoAuth is running!!! :)");
	}
}