class Room {
  constructor(roomName) {
    this.name = roomName;
    this.participants = new Set();
  }

  /**
   * Add a participant to the room.
   *
   * @param {SocketIO.Socket} participants
   * @memberof Room
   */
  addParticipant(participant) {
    this.participants.add(participant);

    participant.join(this.name);
  }

  removeParticipant(participant) {
    this.participants.delete(participant);
  }

  /**
   * Checks if the room is available
   *
   * @returns
   * @memberof Room
   */
  isAvailable() {
    return this.participants.size < 2;
  }

  /**
   * Checks if the room is empty
   *
   * @returns
   * @memberof Room
   */
  isEmpty() {
    return this.participants.size === 0;
  }
}

module.exports = Room;
