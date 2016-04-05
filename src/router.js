// Will serve as my router file
var router = (app,fs) => {
  // var client = fs.readFileSync(__dirname + "/../client/client.html");
  app.get('/', (req, res) => {
    res.render('app');
  });
};

module.exports = router;
