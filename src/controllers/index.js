var loginPage = (req,res) => {
  res.render('login', {csrfToken: req.csrfToken()});
};

var signupPage = (req,res) => {
  res.render('signup', {csrfToken: req.csrfToken()});
};

var gamePage = (req, res)=> {
  res.render("app");
};

module.exports.loginPage = loginPage;
module.exports.signupPage = signupPage;
module.exports.gamePage = gamePage;
module.exports.Account = require('./Account.js');
