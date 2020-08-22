class Message {
  constructor() {
    this.messages = [];
  }

  /**
   * Add a message to the list of messages
   *
   * @param {*} messageObj
   * @memberof Message
   */
  add(messageObj) {
    this.messages.push(messageObj);
  }

  /**
   * Get messages of a room
   *
   * @param {string} roomName
   * @returns {Array}
   * @memberof Message
   */
  getByRoomName(roomName) {
    return this.messages.filter((message) => message.roomName === roomName);
  }

  /**
   * Remove messages of a room
   *
   * @param {string} roomName
   * @returns {Array}
   * @memberof Message
   */
  removeByRoomName(roomName) {
    return this.messages.filter((message) => message.roomName !== roomName);
  }
}

module.exports = new Message();
