var sockets = io => {
  var onJoin =socket => {
    socket.on('join', data=> {
      socket.join('room1');
    });
    socket.on('leaving', data=> {
      // Remove players from room if they disconnect mid game.
    });
  };
  var onMsg =socket => {
    socket.on('update', data=> {
      socket.to(data.room).emit("respond", {row:data.row, col:data.col, color:data.color});
    });
  };

  io.sockets.on("connection", socket => {
    onJoin(socket);
    onMsg(socket);
  });
};

module.exports = sockets;
