window.onload = () => {
  "use strict";

  var socket;
  var user = {};
  var hostCanvas;
  var hostMat;

  var colorMap = { //'#'+Math.floor(Math.random()*16777215).toString(16);
    1 : "#CD0CDD", 2 : "#5DE9C5",
    3 : "#73BA21", 4 : "#ED4252",
    5 : "#EB401A", 6 : "#B7BE2D",};

  var init = () =>{
    socket = io.connect();
    hostCanvas = getElem("#host");
    user.name = "#" + hostCanvas.getAttribute("data-name");

    hostMat = new Array(3);
    for(var k = 0; k<3; k++){
      hostMat[k] = new Array(3);
    }

    for(var i = 0; i<3; i++){
      for(var j = 0; j<3; j++){
        hostMat[i][j] = Math.floor(Math.random()*6);
      }
    }

    canvasSetup();
    initSockets();

    window.beforeunload = () => {
      socket.emit("leaving", user);
    };

  };

  var canvasSetup = () => {
    var hostCTX = hostCanvas.getContext('2d');

    hostCTX.fillStyle = "#FFF";
    hostCTX.fillRect(0,0,hostCanvas.width,hostCanvas.height);

    hostCanvas.addEventListener("click", handleClick);
    redraw(hostMat, "#host");
  };

  var handleClick = (e) => {
    var x = e.offsetX;
    var y = e.offsetY;

    var hostCTX = hostCanvas.getContext('2d');
    var setX = Math.floor(x/100);
    var setY = Math.floor(y/100);
    // console.log(`${setX},${setY}`);
    hostMat[setY][setX] = hostMat[setY][setX] == 6 ? 1 : hostMat[setY][setX] + 1;

    // hostCTX.fillStyle = "#FA00FF";
    // hostCTX.fillRect(setX,setY,100,100);
    redraw(hostMat, "#host");
    hostCTX.fillStyle = "#FB0";
    hostCTX.fillRect(x,y,10,10);
    socket.emit('update', {drawMat : hostMat, user: user});
  };

  var initSockets = () =>{
    socket.emit("establish", {name: user.name});

    socket.on('joined', data => {
      var otherCan = document.createElement(canvas);
      otherCan.setAttribute('id',data.sId); //Should change to be socketID
    });

    socket.on('drawThis', data =>{
      redraw(data.colorMat,data.user.name);
    });
  };

  var redraw = (colorMat,canvasId) => {
    var drawCTX = getElem(canvasId).getContext('2d');
    for(var i=0; i<3; i++){
      for(var j=0; j<3; j++){
        var color = colorMat[i][j];
        drawCTX.fillStyle = colorMap[color];
        drawCTX.fillRect(100*j,100*i,100,100);
      }
    }
  };

  init();
  console.log("game loaded");
};
