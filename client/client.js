"use strict";
window.onload = () => {
  console.log("js loaded!");
  /// Code will be continued from here for the client... will look into browserfy or webpack to allow for gerneralizing and module patterning.
  var getElem = selector => {
    return document.querySelector(selector);
  };

  function handleError(message) {
      getElem("#errorMessage").text(message);
      getElem("#domoMessage").animate({width:'toggle'},350);
  }

  function sendAjax(action, data) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', action);
    xhr.send({
        cache: false,
        type: "POST",
        url: action,
        data: data,
        dataType: "json",
        success: function(result, status, xhr) {
            getElem("#domoMessage").animate({width:'hide'},350);

            window.location = result.redirect;
        },
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);

            handleError(messageObj.error);
        }
    });
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
  }

  getElem("#signupSubmit").addEventListener("click", function(e) {
      e.preventDefault();

      getElem("#domoMessage").animate({width:'hide'},350);

      if(getElem("#user").val() == '' || getElem("#pass").val() == '' || getElem("#pass2").val() == '') {
          handleError("RAWR! All fields are required");
          return false;
      }

      if(getElem("#pass").val() !== getElem("#pass2").val()) {
          handleError("RAWR! Passwords do not match");
          return false;
      }

      sendAjax(getElem("#signupForm").attr("action"), getElem("#signupForm").serialize());

      return false;
  });

  getElem("#loginSubmit").addEventListener("click", function(e) {
      e.preventDefault();

      getElem("#domoMessage").animate({width:'hide'},350);

      if(getElem("#user").val() == '' || getElem("#pass").val() == '') {
          handleError("RAWR! Username or password is empty");
          return false;
      }

      sendAjax(getElem("#loginForm").attr("action"), getElem("#loginForm").serialize());

      return false;
  });
};
