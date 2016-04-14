var models = require('../models');

var Account = models.Account;

var loginPage = (req,res) => {
  res.render('login', {csrfToken: req.csrfToken()});
};

var signupPage = (req,res) => {
  res.render('signup', {csrfToken: req.csrfToken()});
};

var logout = (req,res) => {
  req.session.destroy();
  res.redirect('/');
};

var login = (req,res) => {
  if(!req.body.username || !req.body.pass){
    return res.status(400).json({error: "All fields needed."});
  }

  Account.AccountModel.authenticate(req.body.username, req.body.pass, (err, account) => {
      if(err || !account) return res.status(401).json({error: "Wrong user name or password."});

      req.session.account = account.toAPI();
      res.json({redirect: '/game'});
  });
};

var signup = (req, res) => {
  console.log("has all fields");
  if(!req.body.username || !req.body.pass || !req.body.pass2)
    return res.status(400).json({error: "All fields are required."});

  if(req.body.pass !== req.body.pass2)
    return res.status(400).json({error: "Passwords are not the same."});

  Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    var accountData = {
      username: req.body.username,
      salt: salt,
      password: hash,
    };
  console.log("Made a hash");
    var newAccount = new Account.AccountModel(accountData);
  console.log("created account");
    newAccount.save(err => {
      if(err){
        console.log(err);
        return res.status(400).json({error: "There was an error."});
      }

      req.session.account = newAccount.toAPI();
      return res.json({redirect: '/lounge'});
    });

  });
};

var loungePage = (req, res) => {
  console.log(req);
  Account.AccountModel.findByUsername(req.session.account.username,(err,docs)=> {
    if(err && console.log(err)){
      return res.status(400).json({error: "Could not find player"});
    }
    // console.log(docs);
    res.render('lounge', {csrfToken: req.csrfToken(), info: docs});
  });
};

var leaderPage = (req, res) => {
      // Will need to look for the top W/L records later
  Account.AccountModel.findAll((err, docs)=> {
    if(err && console.log(err)){
      return res.status(400).json({error: "Could not find players"});
    }
    res.render('leader', {csrfToken: req.csrfToken(), info: docs});
  });
};

module.exports.loginPage = loginPage;
module.exports.signupPage = signupPage;
module.exports.logout = logout;
module.exports.lounge = loungePage;
module.exports.leaders = leaderPage;
module.exports.login = login;
module.exports.signup = signup;
