window.onload = () => {
  "use strict";

  var socket;

  var init = () =>{
    socket = io.connect();
    initSockets();
  };

  var initSockets = () =>{
    socket.emit("establish", {name: "unclear"});
  };


  var hostCanvas = getElem("#host");
  hostCanvas.style.backgroundColor = '#77C223';
  // var hostCTX = hostCanvas.getContext('2d');
  // hostCTX.setBackground = '#77C223';


  init();
  console.log("game loaded");
};
