//

// hello-mongoose: MongoDB with Mongoose on Node.js example on Heroku.
// Mongoose is a object/data mapping utility for the MongoDB database.
//

// by Ben Wen with thanks to Aaron Heckmann

//
// Copyright 2012 ObjectLabs Corp.  
// ObjectLabs operates MongoLab.com a MongoDb-as-a-Service offering
//
// MIT Licensed
//

// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:  

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software. 

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE. 

//
// Preamble
var http = require ('http');	     // For serving a basic web page.
var url = require ('url');
var mongoose = require ("mongoose"); // The reason for this demo.

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.  
var uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/HelloMongoose';

// The http server will listen to an appropriate port, or default to
// port 5000.
var theport = process.env.PORT || 5000;
var mongoOptions = { db: { safe: true }};

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, mongoOptions, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

// This is the schema.  Note the types, validation and trim
// statements.  They enforce useful constraints on the data.
var ltxSchema = new mongoose.Schema({
  email: { type: String, min: 0
  },  
  name: {
    first: String,
    last: { type: String, trim: true },
	user: { type: String, trim: true }
  },
  ltx: {
    cuser: String
  }
  
});

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'LTXUsers' collection in the MongoDB database
var Tantraz = mongoose.model('Tantraz', ltxSchema);

// Clear out old data
Tantraz.remove({}, function(err) {
  if (err) {
    console.log ('error deleting old data.');
  }
});

// In case the browser connects before the database is connected, the
// user will see this message.
var found = ['DB Connection not yet established.  Try again later.  Check the console output for error messages if this persists.'];

// Create a rudimentary http server.  (Note, a real web application
// would use a complete web framework and router like express.js). 
// This is effectively the main interaction loop for the application. 
// As new http requests arrive, the callback function gets invoked.
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  var queryData = url.parse(req.url, true).query;
  if(queryData.status){
	var newUserAdd = new Tantraz ({
		status: queryData.tx,
		email: queryData.email,
		name: queryData.name,
		reqSite: queryData.t4id,
		time: queryData.stamp,
		ppid: queryData.ppid,
		uid: queryData.uid
		});
	ifUserExists(req, res, newUserAdd);
	
  } else {
	res.end("malformed node request");
  }
 
}).listen(theport);

function ifUserExists (req, res, newUserAdd) {
  if(newUserAdd.email != ""){
      // not sure how we got it, so let's check auth
    Tantraz.find({'email': newUserAdd.email})exec(function(err, result) { // (ok in this example, it's all entries)
		
	  if (!err) {
	  //res.end(html4 + JSON.stringify(result, undefined, 2) + html5 + result.length + html6);
		if(result) {
			newUserAdd.save(function (err) {if (err) console.log ('Error on save!')});
		} else {
			newUserAdd.save(function (err) {if (err) console.log ('Error on save!')});
		}
	  } else {
		
		res.end('Error in second query. ' + err)
	  }
    });
  } else {
      res.end('no email present' + err)
  }
}


// Tell the console we're getting ready.
// The listener in http.createServer should still be active after these messages are emitted.
console.log('http server will be listening on port %d', theport);
console.log('CTRL+C to exit');

//
// House keeping.

//
// The rudimentary HTML content in three pieces.
/*var html1 = '<title> hello-mongoose: MongoLab MongoDB Mongoose Node.js Demo on Heroku </title> \
<head> \
<style> body {color: #394a5f; font-family: sans-serif} </style> \
</head> \
<body> \
<h1> hello-mongoose: MongoLab MongoDB Mongoose Node.js Demo on Heroku </h1> \
See the <a href="https://devcenter.heroku.com/articles/nodejs-mongoose">supporting article on the Dev Center</a> to learn more about data modeling with Mongoose. \
<br\> \
<br\> \
<br\> <h2> All Documents in MonogoDB database </h2> <pre><code> ';
var html2 = '</code></pre> <br\> <i>';
var html3 = ' documents. </i> <br\> <br\>';
var html4 = '<h2> Queried (name.last = "Doe", age >64) Documents in MonogoDB database </h2> <pre><code> ';
var html5 = '</code></pre> <br\> <i>';
var html6 = ' documents. </i> <br\> <br\> \
<br\> <br\> <center><i> Demo code available at <a href="http://github.com/mongolab/hello-mongoose">github.com</a> </i></center>';
*/
