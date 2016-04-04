// Will serve as the app.js but called server.js
var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = socket.io(server);

var router = require('./router.js');
var port = process.env.PORT || process.env.NODE_PORT || 3000;
app.use('/assets', express.static(path.resolve(__dirname+'/../client/')));

router(app);

app.listen(port, err => {
  if(err) throw err;

  console.log(`Listening on port: ${port}`);
});