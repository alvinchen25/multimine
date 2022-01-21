const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  // times: [Number],
  times: [{ score: Number, boardSize: String, gameTime: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now,
  } }],
  topscoreSmall: { score: Number, boardSize: String, gameTime: {
    type: Date,
    default: Date.now
  }},
  topscoreMedium: { score: Number, boardSize: String, gameTime: {
    type: Date,
    default: Date.now
  }},
  topscoreLarge: { score: Number, boardSize: String, gameTime: {
    type: Date,
    default: Date.now
  }},
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
