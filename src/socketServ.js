var init = io => {

  var activeRoom = 'room1';

  var onJoin = socket => {
    socket.on('establish', data => {
      console.log(data.name);

      socket.join(activeRoom);
      // console.log(socket);

      data.sId = socket.id;
      data.room = activeRoom;

      socket.to(activeRoom).broadcast.emit('joined', data);
      socket.emit('setRoom', {room: activeRoom});
    });

    socket.on('leaving', data => {
      // Remove players from room if they disconnect mid game.
      data.room ? socket.leave(data.room) : socket.emit('error', {msg:"no room passed"});
    });

  };

  var onMsg = socket => {
    socket.on('update', data=> {
      socket.to(data.room).emit("respond", {row:data.row, col:data.col, color:data.color});
    });
  };

  io.sockets.on("connection", socket => {
    console.log('connection hit.');
    onJoin(socket);
    onMsg(socket);
  });

  io.sockets.on("disconnect", socket => {
    socket.leave('room1');
  });
};

module.exports.socketsSetup = init;
