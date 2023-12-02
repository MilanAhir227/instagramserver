// socket.js
const { Server } = require("socket.io");
const MESSAGE = require("./model/Message");

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", async (socket) => {
    console.log(`User connected`);

    socket.on('setmessages', async ({ converstionId }) => {
      if (converstionId) {
        const Messages = await MESSAGE.find({ converstionId: converstionId })
        console.log(Messages);
        socket.emit('getmessage', Messages)
      }
    });

    socket.on("send message", async (data) => {
      const newMessage = await MESSAGE({
        converstionId: data.converstionId,
        senderid: data.senderid,
        message: data.message
      })
      newMessage.save()

      const Messages = await MESSAGE.find({ converstionId: data.converstionId })
      socket.broadcast.emit('receive', Messages)
    });
  });

  return io;
}

module.exports = setupSocket;
