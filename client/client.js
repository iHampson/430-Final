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
      getElem("#errDiv").style.display = block;
  };

  var sendAjax = (action, data) => {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', action);
    xhr.setRequestHeader('Content-type', 'json');
    xhr.send(data);

    xhr.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(xhr.responseText);
        window.location = data.redirect;
      }
    };

    xhr.onerror = () => {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    };
      // $.ajax({
      //     cache: false,
      //     type: "POST",
      //     url: action,
      //     data: data,
      //     dataType: "json",
      //     success: function(result, status, xhr) {
      //         getElem("#domoMessage").animate({width:'hide'},350);
      //
      //         window.location = result.redirect;
      //     },
      //     error: function(xhr, status, error) {
      //         var messageObj = JSON.parse(xhr.responseText);
      //
      //         handleError(messageObj.error);
      //     }
      // });
  };

  getElem("#signupSubmit") && getElem("#signupSubmit").addEventListener("click", (e) => {
      e.preventDefault();

      if(getElem("#user").val() === '' || getElem("#pass").val() === '' || getElem("#pass2").val() === '') {
          document.alert("All fields are required");
          return false;
      }

      if(getElem("#pass").val() !== getElem("#pass2").val()) {
          handleError("RAWR! Passwords do not match");
          return false;
      }

      sendAjax(getElem("#signupForm").attr("action"), getElem("#signupForm").serialize());

      return false;
  });

  getElem("#loginSubmit") && getElem("#loginSubmit").addEventListener("click", function(e) {
      e.preventDefault();

      // getElem("#domoMessage").animate({width:'hide'},350);

      if(getElem("#user").val() === '' || getElem("#pass").val() === '') {
          handleError("RAWR! Username or password is empty");
          return false;
      }

      sendAjax(getElem("#loginForm").attr("action"), getElem("#loginForm").serialize());

      return false;
  });
};
