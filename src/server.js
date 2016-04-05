// Will serve as the app.js but called server.js
var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var dbURL = process.env.MONGOLAB_URI || "mongodb://localhost/DomoMaker";
var db = mongoose.connect(dbURL, err =>{
  if(err){
    console.log("Could not connect to database");
    throw(err);
  }
});

var router = require('./router.js');
var sockets = require('./socketServ.js');
var port = process.env.PORT || process.env.NODE_PORT || 3000;

app.use('/assets', express.static(path.resolve(__dirname+'/../client/')));

app.set('view engine', 'jade');
app.set('views', `${__dirname}/views`);

router(app);

app.listen(port, err => {
  if(err) throw err;
  console.log(`Listening on port: ${port}`);
});
sockets(io);
