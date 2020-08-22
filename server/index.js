const Express = require('express');
const cors = require('cors');
const Socket = require('./classes/socket');

const PORT = 4000;
const app = Express();

app.use(cors());

const server = app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

const socket = new Socket(server);
socket.init();
