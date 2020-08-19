const Express = require('express');
const cors = require('cors');
let messages = require('./datas');

const PORT = 4000;
const rooms = [];
const app = Express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

const serve = app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

const io = require('socket.io')(serve);

io.on('connect', (socket) => {
  if (!isThereARoomAvailable()) {
    createRoom();
  }

  const availableRoomIndex = getTheFirstRoomNotFullIndex();
  const roomName = getRoomName(availableRoomIndex);
  setUserInRoom(socket, availableRoomIndex);
  setWaiting(roomName, availableRoomIndex);

  socket.emit('id', socket.id);

  socket.on('disconnect', () => {
    removeUserInRoom(socket, availableRoomIndex);
    removeMessagesByRoomName(roomName);
    setWaiting(roomName, availableRoomIndex);
  });

  socket.on('start-writing', (isTyping) => {
    socket.to(roomName).emit('writing', isTyping);
  });

  socket.on('stop-writing', (isTyping) => {
    socket.to(roomName).emit('writing', isTyping);
  });

  socket.on('send-message', (message) => {
    messages.push({
      date: new Date().toISOString(),
      author: socket.id,
      content: message,
      roomName,
    });

    const roomMessage = messages.filter(
      (message) => message.roomName === roomName
    );

    socket.to(roomName).emit('writing', false);
    io.to(roomName).emit('update-messages', roomMessage);
  });
});

function getRoomName(roomIndex) {
  return `room ${roomIndex}`;
}

function isThereARoomAvailable() {
  if (rooms.length < 1) return false;

  return rooms.some((room) => isNotFull(room));
}

function createRoom() {
  rooms.push([]);
}

function isNotFull(room) {
  return room.length < 2;
}

function getTheFirstRoomNotFullIndex() {
  return rooms.findIndex((room) => isNotFull(room));
}

function setUserInRoom(socket, roomIndex) {
  rooms[roomIndex].push(socket);
  const roomName = getRoomName(roomIndex);

  socket.join(roomName, () => {
    console.log(`${roomName} joined`);
  });
}

function setWaiting(roomName, roomIndex) {
  if (rooms[roomIndex].length < 2) {
    io.to(roomName).emit('start-waiting');
  } else {
    io.to(roomName).emit('end-waiting');
  }
}

function removeUserInRoom(socket, roomIndex) {
  rooms[roomIndex] = rooms[roomIndex].filter((user) => user.id !== socket.id);
}

function removeMessagesByRoomName(roomName) {
  messages = messages.filter((message) => message.roomName !== roomName);
  io.to(roomName).emit('update-messages', messages);
}
