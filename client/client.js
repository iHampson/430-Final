window.onload = () => {
"use strict";
  console.log("js loaded!");
  /// Code will be continued from here for the client... will look into browserfy or webpack to allow for gerneralizing and module patterning.
  var getElem = selector => {
    return document.querySelector(selector);
  };

  var handleError = (message) => {
      console.log(message);
      getElem("#errorMsg").innerHTML = message;
      getElem("#errDiv").style.display = "block";
  };

  var sendAjax = (action, data) => {
    console.log(action,data);
    superagent
      .post(action)
      .send(data)
      .set('Accept','application/json')
      .set('X-CSRF-Token', data._csrf)
      .end((err, res) => {
        err && !res.ok && handleError(res.error);
        console.log(res);
        window.location = res.body.redirect;
      });

    // var xhr = new XMLHttpRequest();
    // xhr.open('post', action);
    // xhr.setRequestHeader('Content-type', 'json');
    // xhr.onload = () => {
    //   if (xhr.status >= 200 && xhr.status < 400) {
    //     var data = JSON.parse(xhr.responseText);
    //     window.location = data.redirect;
    //   }
    // };
    // xhr.onerror = () => {
    //   var messageObj = JSON.parse(xhr.responseText);
    //   handleError(messageObj.error);
    // };
    // xhr.send(data);
      // $.ajax({
      //     cache: false,
      //     type: "POST",
      //     url: action,
      //     data: data,
      //     dataType: "json",
      //     success: function(result, status, xhr) {
      //         getElem("#domoMessage").animate({width:'hide'},350);
      //         window.location = result.redirect;
      //     },
      //     error: function(xhr, status, error) {
      //         var messageObj = JSON.parse(xhr.responseText);
      //         handleError(messageObj.error);
      //     }
      // });
  };

  getElem("#signupSubmit") && getElem("#signupSubmit").addEventListener("click", (e) => {
      e.preventDefault();

      if(getElem("#user").value === '' || getElem("#pass").value === '' || getElem("#pass2").value === '') {
          handleError("All fields are required");
          return false;
      }

      if(getElem("#pass").value !== getElem("#pass2").value) {
          handleError("RAWR! Passwords do not match");
          return false;
      }
      var formData = {
        username: getElem("#user").value,
        pass: getElem("#pass").value,
        pass2: getElem("#pass2").value,
        _csrf: getElem("#csrf").value,
      };
      sendAjax(getElem("#signupForm").action, formData);

      return false;
  });

  getElem("#loginSubmit") && getElem("#loginSubmit").addEventListener("click", function(e) {
      e.preventDefault();

      if(getElem("#user").value === '' || getElem("#pass").value === '') {
          handleError("RAWR! Username or password is empty");
          return false;
      }

      var formData = {
        username: getElem("#user").value,
        pass: getElem("#pass").value,
        _csrf: getElem("#csrf").value,
      };
      sendAjax(getElem("#loginForm").action, formData);

      return false;
  });
};
