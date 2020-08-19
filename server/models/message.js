module.exports = new (class Message {
  constructor() {
    this.messages = [];
  }

  add(messageObj) {
    this.messages.push(messageObj);
  }

  getByRoomName(roomName) {
    return this.messages.filter((message) => message.roomName === roomName);
  }

  removeByRoomName(roomName) {
    return this.messages.filter((message) => message.roomName !== roomName);
  }
})();
