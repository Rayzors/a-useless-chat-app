const Room = require('./room');

class Rooms {
  constructor() {
    this.rooms = new Map();
  }

  /**
   * Create a new room.
   *
   * @memberof Rooms
   */
  createRoom() {
    const roomName = `room ${Date.now()}`;
    const room = new Room(roomName);

    this.rooms.set(roomName, room);

    return this.rooms.get(roomName);
  }

  /**
   * Remove a room by roomName
   *
   * @param {string} roomName
   * @memberof Rooms
   */
  destroyRoom(roomName) {
    this.rooms.delete(roomName);
  }

  /**
   * Get an available room
   * if no room is available it returns undefined.
   *
   * @returns {Room|undefined}
   * @memberof Rooms
   */
  getAvailableRoom() {
    if (this.rooms.size < 1) return undefined;

    return [...this.rooms.values()].find((room) => room.isAvailable());
  }
}

module.exports = new Rooms();
