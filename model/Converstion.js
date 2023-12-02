const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const converstionSchema = new Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

const CONVERSTION = mongoose.model("converstion", converstionSchema);

module.exports = CONVERSTION;
