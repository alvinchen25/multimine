const mongoose = require("mongoose");

//define a Room schema for the database
const RoomSchema = new mongoose.Schema({ // it still gets an _id in addition to this roomId thing
    roomId: String,
    // eventually will have a lot more info about the room carried
});

// compile model from schema
module.exports = mongoose.model("room", RoomSchema);