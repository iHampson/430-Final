
var getElem = selector => {
  var temp = selector;
  if(selector.charAt(0) != '#' && selector.charAt(0) != '.'){
      temp = '#' + temp;
  }
  return document.querySelector(temp);
};

var handleError = (message) => {
    console.log(message);
    getElem("#errorMsg").innerHTML = message;
    getElem("#errDiv").classList.contains('is-hidden') && getElem("#errDiv").classList.remove('is-hidden');
};

var sendAjax = (action, data) => {
  console.log(action,data);
  superagent
    .post(action)
    .send(data)
    .set('Accept','application/json')
    .set('X-CSRF-Token', data._csrf)
    .end((err, res) => {
      err && !res.ok && handleError(err);
      res.body.redirect ?  window.location = res.body.redirect : console.log(res);
    });
};
