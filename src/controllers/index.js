var loginPage = (req,res) => {
  res.render('login', {csrfToken: req.csrfToken()});
};

var signupPage = (req,res) => {
  res.render('signup', {csrfToken: req.csrfToken()});
};

module.exports.loginPage = loginPage;
module.exports.signupPage = signupPage;
module.exports.Account = require('./Account.js');
