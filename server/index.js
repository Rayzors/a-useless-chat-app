const Express = require('express');
const cors = require('cors');
const Message = require('./classes/message');
const RoomCollection = require('./classes/rooms');

const PORT = 4000;
const app = Express();

app.use(cors());

const serve = app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

const io = require('socket.io')(serve);

io.on('connect', (socket) => {
  let room = RoomCollection.getAvailableRoom();

  if (!room) {
    room = RoomCollection.createRoom();
  }

  room.addParticipant(socket);
  setWaiting(room);

  socket.emit('id', socket.id);

  socket.on('disconnect', () => {
    room.removeParticipant(socket);
    const messages = Message.removeByRoomName(room.name);
    io.to(room.name).emit('update-messages', messages);
    setWaiting(room);
  });

  socket.on('start-writing', (isTyping) => {
    socket.to(room.name).emit('writing', isTyping);
  });

  socket.on('stop-writing', (isTyping) => {
    socket.to(room.name).emit('writing', isTyping);
  });

  socket.on('send-message', (message) => {
    Message.add({
      date: new Date().toISOString(),
      author: socket.id,
      content: message,
      roomName: room.name,
    });

    const roomMessage = Message.getByRoomName(room.name);

    socket.to(room.name).emit('writing', false);
    io.to(room.name).emit('update-messages', roomMessage);
  });
});

function setWaiting(room) {
  if (room.participants.size < 2) {
    io.to(room.name).emit('start-waiting');
  } else {
    io.to(room.name).emit('end-waiting');
  }
}
