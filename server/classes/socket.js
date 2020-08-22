const Message = require('./message');
const RoomCollection = require('./rooms');

class Socket {
  constructor(server) {
    this.io = require('socket.io')(server);
  }

  /**
   * On connect of the user
   * - Find an available room
   * - Create a new room if no one exists
   * - Add the user to the room
   *
   * @memberof Socket
   */
  init() {
    this.io.on('connect', (socket) => {
      let room = RoomCollection.getAvailableRoom();

      if (!room) {
        room = RoomCollection.createRoom();
      }

      room.addParticipant(socket);

      if (room.isAvailable()) {
        this.io.to(room.name).emit('start-waiting');
      } else {
        this.io.to(room.name).emit('end-waiting');
      }

      socket.emit('id', socket.id);
      this.onDisconnect(socket, room);
      this.onStartWriting(socket, room);
      this.onStopWriting(socket, room);
      this.onSendMessage(socket, room);
    });
  }

  /**
   * On disconnect of a user
   * - Remove the user from the room
   * - Remove messages of the room
   * - Destroy the room if necessary
   *
   * @param {SocketIO.Socket} socket
   * @param {Room} room
   * @memberof Socket
   */
  onDisconnect(socket, room) {
    socket.on('disconnect', () => {
      room.removeParticipant(socket);
      Message.removeByRoomName(room.name);

      if (room.isEmpty()) {
        RoomCollection.destroyRoom(room.name);
        return;
      }

      if (room.isAvailable()) {
        this.io.to(room.name).emit('start-waiting');
      } else {
        this.io.to(room.name).emit('end-waiting');
      }

      this.io.to(room.name).emit('update-messages', Message.messages);
    });
  }

  /**
   * Allow to detect when an user start to type
   *
   * @param {SocketIO.Socket} socket
   * @param {Room} room
   * @memberof Socket
   */
  onStartWriting(socket, room) {
    socket.on('start-writing', (isTyping) => {
      socket.to(room.name).emit('writing', isTyping);
    });
  }

  /**
   * Allow to detect when an user stop to type
   *
   * @param {SocketIO.Socket} socket
   * @param {Room} room
   * @memberof Socket
   */
  onStopWriting(socket, room) {
    socket.on('stop-writing', (isTyping) => {
      socket.to(room.name).emit('writing', isTyping);
    });
  }

    /**
   * Save the user message and emit an event
   * to update the list
   *
   * @param {SocketIO.Socket} socket
   * @param {Room} room
   * @memberof Socket
   */
  onSendMessage(socket, room) {
    socket.on('send-message', (message) => {
      Message.add({
        date: new Date().toISOString(),
        author: socket.id,
        content: message,
        roomName: room.name,
      });

      const roomMessage = Message.getByRoomName(room.name);

      socket.to(room.name).emit('writing', false);
      this.io.to(room.name).emit('update-messages', roomMessage);
    });
  }
}

module.exports = Socket;
