const messages = require('../../datas.js');

module.exports = (root, { data }, context) => {
  try {
    const date = new Date().toISOString();
    const newMessage = { ...data, date };

    messages.push(newMessage);

    return newMessage;
  } catch (e) {
    console.log(e);
  }
};
