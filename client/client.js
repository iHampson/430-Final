window.onload = () => {
"use strict";
  console.log("client loaded!");
  /// Code will be continued from here for the client... will look into browserfy or webpack to allow for gerneralizing and module patterning.

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
