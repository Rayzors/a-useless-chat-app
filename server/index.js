const Express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema.js');
const resolvers = require('./resolvers');
const cors = require('cors');

const PORT = 4000;

const rooms = [];

const app = Express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

const serve = app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

const io = require('socket.io')(serve);

io.on('connection', (socket) => {
  if (!isThereARoomAvailable()) {
    createRoom();
  }

  const availableRoomIndex = getTheFirstRoomNotFullIndex();
  setUserInRoom(socket, availableRoomIndex);

  socket.on('disconnect', () => {
    removeUserInRoom(socket, availableRoomIndex);
  });

  socket.on('start-writing', (isTyping) => {
    socket.to(getRoomName(availableRoomIndex)).emit('writing', isTyping);
  });

  socket.on('stop-writing', (isTyping) => {
    socket.to(getRoomName(availableRoomIndex)).emit('writing', isTyping);
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

function removeUserInRoom(socket, roomIndex) {
  rooms[roomIndex] = rooms[roomIndex].filter((user) => user.id !== socket.id);
}
