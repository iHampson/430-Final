var init = io => {

  var roomCount = 1;
  var userCount = 0;
  var activeRoom = 'room' + roomCount;

  var players = {};
  var solutions = {};
  players.room1 = {};
  solutions.room1 = {};

  var launchGame = (socket,room) => {
    // console.log('Creating source Mat');
    var sourceMat = new Array(3);
    for(var k = 0; k<3; k++){
      sourceMat[k] = new Array(3);
    }
    for(var i = 0; i<3; i++){
      for(var j = 0; j<3; j++){
        sourceMat[i][j] = Math.floor(Math.random()*6)+1;
      }
    }
    // console.log('Saving Mat');
    solutions[room] = sourceMat;
    // console.log('Sending Mat');
    io.in(room).emit('beginGame',{matToMatch: sourceMat});
  };

  var checkMat = (matrix, user, socket) => {
    var status = true;
    var answer = solutions[user.room];
    console.log('Checking mat');
    for(var i =0; i< 3; i++){
      for(var j=0; j<3; j++){
        if( matrix[i][j] != answer[i][j] ){
          status = false;
        }
      }
    }
    console.log(status);
    status && io.in(user.room).emit('winning', user);
  };

  var onJoin = socket => {

    socket.on('establish', data => {

      userCount += 1;
      console.log(data.name);

      // console.log(players[activeRoom]);
      socket.emit('setRoom', {room: activeRoom}); //playersInRoom: players});
      for(var playerObj in players[activeRoom]){
        // console.log(players[activeRoom][playerObj]);
        socket.emit('joined', players[activeRoom][playerObj]);
      }

      socket.join(activeRoom);
      data.sId = socket.id;
      data.room = activeRoom;

      // console.log(activeRoom);
      var myName = data.name;

      players[activeRoom][myName] = data;

      socket.to(activeRoom).broadcast.emit('joined', data);

      if(Object.getOwnPropertyNames(players[activeRoom]).length == 4){
        launchGame(socket,activeRoom);
        console.log(`Game launched in room ${activeRoom}`);
        roomCount++;
        activeRoom = 'room' + roomCount;
        players[activeRoom] = [];
      }
    });

    socket.on('ready', data => {

    });

    socket.on('leaving', data => {
      // Remove players from room if they disconnect mid game.
      data.room ? socket.leave(data.user.room) : socket.emit('error', {msg:"no room passed"});
      console.log(`${data.user.name} has left ${data.user.room}`);
      userCount -= 1;
    });

  };

  var onMsg = socket => {
    socket.on('update', data => {
      // console.log("updating " + data.user.name + " in " + data.user.room);
      socket.to(data.user.room).emit("drawThis", data);
      if(data.gameState){
        // console.log(data);
        checkMat(data.drawMat, data.user, socket);
      }
    });

    socket.on('endGame', data => {

    });
  };

  io.sockets.on("connection", socket => {
    console.log('connection opened.');
    onJoin(socket);
    onMsg(socket);
  });

  io.sockets.on("disconnect", socket => {

  });
};

module.exports.socketsSetup = init;
