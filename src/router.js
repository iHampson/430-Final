// Will serve as my router file
var router = (app) => {
  // var client = fs.readFileSync(__dirname + "/../client/client.html");
  app.get('/', controllers.Account.loginPage);
  app.get('/login',controllers.Account.loginPage);
  app.get('/signup', controllers.Account.signupPage);
  app.get('/game', (req, res)=> {
    res.render("app");
  });
};

module.exports.router = router;
