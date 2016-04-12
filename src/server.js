// Will serve as the app.js but called server.js
var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var url = require('url');
var csrf = require('csurf');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var router = require('./router.js');
var sockets = require('./socketServ.js');

var dbURL = process.env.MONGOLAB_URI || "mongodb://localhost/DomoMaker";
var db = mongoose.connect(dbURL, err =>{
  if(err){
    console.log("Could not connect to database");
    throw(err);
  }
});

var redisURL = {
  hostname: 'localhost',
  port: 6379,
};
var redisPass;
if(process.env.REDISCLOUD_URL){
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPass = redisURL.auth.split(":")[1];
}


var port = process.env.PORT || process.env.NODE_PORT || 3000;

app.use('/assets', express.static(path.resolve(__dirname+'/../client/')));
app.use(compression());
app.use(bodyParser.urlencoded({extended:true}));
app.disable('x-powered-by');
app.use(cookieParser());
app.use(session({
  key:"sessionid",
  store: new RedisStore({
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPass,
  }),
  secret: "Graduation Desired",
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));
app.use(csrf());
app.use( (err, req, res, next) => {
  if(err.code !== 'EBADCSRFTOKEN'){ return next(err); }
  return;
});

app.set('view engine', 'jade');
app.set('views', `${__dirname}/views`);

router(app);

app.listen(port, err => {
  if(err) throw err;
  console.log(`Listening on port: ${port}`);
});
sockets(io);
