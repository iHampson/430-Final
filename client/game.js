window.onload = () => {
  "use strict";

  var socket;
  var user = {};
  var hostCanvas;
  var hostMat;
  var matchingMat;
  var gameOn

  var colorMap = { //'#'+Math.floor(Math.random()*16777215).toString(16);
    1 : "#CD0CDD", 2 : "#5DE9C5",
    3 : "#73BA21", 4 : "#ED4252",
    5 : "#EB401A", 6 : "#B7BE2D",};

  var init = () =>{
    socket = io.connect();
    hostCanvas = getElem("#host");
    user.name = hostCanvas.getAttribute("data-name");
    gameOn = false;

    hostMat = new Array(3);
    for(var k = 0; k<3; k++){
      hostMat[k] = new Array(3);
    }

    for(var i = 0; i<3; i++){
      for(var j = 0; j<3; j++){
        hostMat[i][j] = Math.floor(Math.random()*6)+1;
      }
    }

    canvasSetup();
    initSockets();

    window.onbeforeunload = () => {
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

    redraw(hostMat, "#host");
    hostCTX.fillStyle = "#FB0";
    // hostCTX.fillRect(x,y,10,10);
    socket.emit('update', {drawMat : hostMat, gameState : gameOn, user});
  };

  var initSockets = () =>{
    socket.emit("establish", {name: user.name, mat: hostMat});

    socket.on('joined', data => {
      console.log(data);
      data.name != user.name && addCanvas(data.name, data.sId, data.mat);
    });

    socket.on('drawThis', data =>{
      redraw(data.drawMat, data.user.name);
    });

    socket.on('setRoom', data => {
      user.room = data.room;
      console.log(data);
    });

    socket.on('beginGame', data =>{
      console.log("game started");
      matchingMat = data.matToMatch;
      document.querySelector('#source').classList.remove("is-hidden");
      redraw(matchingMat,'source');
      gameOn = true;
    });

    socket.on('winning', data =>{
      if(data.name === user.name){
        handleError("You won!");
        socket.emit('leaving', {user});
      }else{
        handleError("You lost!");
        socket.emit('leaving', {user});
      }
      gameOn = false;
      var token = getElem('#csrf').value;
      sendAjax('/game', {user,win:gameOn,csrfToken:token});

    });
  };

  var redraw = (colorMat,canvasId) => {
    var activeCan = getElem(canvasId);
    var drawCTX =  activeCan.getContext('2d');
    var width = activeCan.width/3;
    for(var i=0; i<3; i++){
      for(var j=0; j<3; j++){
        var color = colorMat[i][j];
        drawCTX.fillStyle = colorMap[color];
        drawCTX.fillRect(width*j,width*i,width,width);
      }
    }
  };

  var createTile = () => {
    var newParentTile = document.createElement("div");
    var newChildTile = document.createElement("div");

    var parentClasses = "tile is-parent is-2";
    var childClasses = "tile is-child notification is-success";

    newParentTile.setAttribute('class', parentClasses);
    newChildTile.setAttribute('class', childClasses);

    newParentTile.appendChild(newChildTile);

    return newParentTile;
  };

  var addCanvas = (name, sId, mat) => {
    var newTile = createTile();
    var otherCan = document.createElement("canvas");
    otherCan.width = 150;
    otherCan.height = 150;

    otherCan.setAttribute('id', name);
    otherCan.setAttribute('data-sId', sId);

    var container = document.getElementById("viewing");
    var trigger = getElem('#waiting');
    container && trigger && container.removeChild(document.getElementById("waiting"));

    newTile.firstElementChild.appendChild(otherCan);
    container.appendChild(newTile);
    redraw(mat, `#${name}`);
  };

  init();
  console.log("game loaded");
};
