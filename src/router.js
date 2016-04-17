// Will serve as my router file
var controllers = require('./controllers');

var router = (app) => {
  // var client = fs.readFileSync(__dirname + "/../client/client.html");
  app.get('/', controllers.loginPage);
  app.get('/login',controllers.loginPage);
  app.get('/signup', controllers.signupPage);
  app.get('/lounge', controllers.Account.lounge);
  app.get('/leaders', controllers.Account.leaders);
  app.get('/game', (req, res)=> {
    res.render("app");
  });

  app.post('/login', controllers.Account.login);
  app.post('/signup', controllers.Account.signup);

};

module.exports = router;
