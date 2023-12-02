// socket.js
const { Server } = require('socket.io')
const MESSAGE = require('./model/Message')

function setupSocket (server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000'
    }
  })

  io.on("connection", (socket) => {
    console.log("Socket connected: ", socket.id);

    socket.on('getMessage',async (converstionid) =>{
      const Messages = await MESSAGE.find({conversationId : converstionid})

      socket.emit('setMessage',Messages)
    })

    socket.on('newMessage',async(data) =>{
      try {
        await MESSAGE.create({
          conversationId: data.converstionid ,
          senderid: data.senderid,
          message: data.message,
        })

      } catch (error) {
        console.log(error);
      }
    })

    socket.on("disconnect", () => {
      console.log("Socket disconnected: ", socket.id);
    });
 });


  return io
}

module.exports = setupSocket
