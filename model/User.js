const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    fullname : String,
    contact : String,
    uname : {
        type : String,
        unique : true
    },
    password : String,
    email : String,
    date : {
        type : Date,
        default : Date.now
    },
    profileimg : String,
    followers : {
        type : Array,
    },
    following : {
        type : Array,
    },
    post :{
        type : Array,
    } ,
    bio : {
        type : String
    },
    liked :{
        type : Array,
    },
    saved :{
        type : Array,
    }

  });

  const USER = mongoose.model("user", userSchema);

module.exports = USER;