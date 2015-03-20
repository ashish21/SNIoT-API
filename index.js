// Thingspeak client instance
//
var ThingSpeakClient = require('thingspeakclient');
var client = new ThingSpeakClient();

// Request instance
//
var request = require('request');

// Express instance
//
var express = require('express');
var app = express();

// MongoDB instance
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// API key
//
var userApiKey = 'ZJJX11KQ0VD2VYUY';

// API url
//
var url = 'https://api.thingspeak.com/';

// Create Channel
// Creates a new channel and provides its Channel ID and write API key to the callback
//
// id = channelId of the new channel
// key = writeKey for the channel
// Usage:
// createChannel(function(id,key) {
   //Do something with id and key//
// });
//
function createChannel(callback) {
	request({
		url: url+'channels.json',
		method: 'POST',
		qs: { api_key: userApiKey }
	}, function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	        	var channel = JSON.parse(body);
		        callback(channel.id,channel.api_keys[0].api_key);
	        	/*client.attachChannel(channel.id, { writeKey: channel.api_keys[0].api_key}, function(err) {
				    if (!err)
				        getChannelData(channel.id, channel.api_keys[0].api_key);
				});*/
	        }
	    }
	);
}

var findDocuments = function(db, callback) {
  // Get the documents collection 
  var collection = db.collection('documents');
  // Find some documents 
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });      
}

// Connection URL 
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
  //assert.equal(null, err);
  console.log("Connected correctly to server");
  findDocuments(db, function(docs) {
	  app.get('/keys/:macaddress', function(req, res) {
		  var macAdd = req.params.macaddress;
		  if(macAdd < 0) {
		    res.statusCode = 404;
		    return res.send('Error 404: No mac found');
		  }
		  docs.forEach(function(i) {
		      if (i.mac == macAdd){
		      	var jRes = {channelId : i.id, writeKey : i.key}
		      	res.json(jRes);
		      }
		  });
		});
	    db.close();
  });
});

app.listen(27021);

/*function getChannelKey(channelId) {
	client.getChannelFeeds(channelId, {}, function(err, resp) {
	    if (!err && resp > 0) {
	        console.log(resp);
	    }
	    else {
	    	console.log('error');
	    }
	});
}*/
/*function getChannelData(channelId, channelKey) {
	client.getChannelFeeds(channelId, {api_key: channelKey}, function(err, resp) {
	    if (!err && resp > 0)
	        console.log(resp);
	    else
	    	console.log('error');
	});
}*/