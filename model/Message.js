const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    converstionId: {
      type: String,
    },
    senderid: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

const MESSAGE = mongoose.model("Message", MessageSchema);

module.exports = MESSAGE;
