const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  // times: [Number],
  times: [{ score: Number, gameTime: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now
  } }],
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
