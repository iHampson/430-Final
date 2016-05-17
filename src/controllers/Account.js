var models = require('../models');

var Account = models.Account;

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

    var newAccount = new Account.AccountModel(accountData);
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
  // console.log(req);
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
    docs.sort((a,b) => {
      if(a.wins > b.wins) return -1;
      if(a.wins == b.wins) return 0;
      if(a.wins < b.wins) return 1;
    });
    res.render('leader', {csrfToken: req.csrfToken(), info: docs});
  });
};

var gamePage = (req, res) => {
  Account.AccountModel.findByUsername(req.session.account.username,(err,docs)=> {

    if(err && console.log(err)){
      return res.status(400).json({error: "Could not find player"});
    }

    res.render('app', {csrfToken:req.csrfToken(), info: docs});
  });

};

var gameUp = (req, res) => {
  Account.AccountModel.findByUsername(req.session.account.username,(err,docs)=> {

    if(err && console.log(err)){
      return res.status(400).json({error: "Could not find player"});
    }
    req.body.win ? docs.wins++ : docs.lose ++;

    docs.save( err=>{
      return res.json({err:err});
    });

    return res.json({redirect: '/lounge'});
  });
};

module.exports.logout = logout;
module.exports.lounge = loungePage;
module.exports.leaders = leaderPage;
module.exports.game = gamePage;
module.exports.login = login;
module.exports.signup = signup;
module.exports.gameUpdate = gameUp;
