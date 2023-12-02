const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    uid : String,
    img : {
        type : String,
        default : 'upload image'
    },
    likes : Array,
    saved : Array,
    comments : Array,
    date : {
        type : Date,
        default : Date.now
    },
    caption : String

  });

  const POST = mongoose.model("post", userSchema);

module.exports = POST;