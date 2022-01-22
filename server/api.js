/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
// const Story = require("./models/story");
// const Comment = require("./models/comment");
const User = require("./models/user");
const Message = require("./models/message");
const Room = require("./models/room");
const Run = require("./models/run");
// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

const socketManager = require("./server-socket");
const gameUtils = require("./game-utils");
const ObjectId = require('mongodb').ObjectId;


router.get("/room", (req, res) => {
  // empty selector means get all documents
  Room.find({}).then((rooms) => res.send(rooms));
}); //access room list

router.post("/room", (req, res) => {
  const code = gameUtils.genRoomCode();

  const newRoom = new Room({
    name: req.body.name,
    code: code,
    isPrivate: req.body.isPrivate,
    boardSize: req.body.boardSize,
    status: "open",
  });

  newRoom.save().then((room) => {
    res.send(room);
  });
  gameUtils.setRoomCode(newRoom._id, code);
  gameUtils.setGameStatus(newRoom._id, "before");
  socketManager.getIo().emit("activeRoom", newRoom);
});

router.post("/deleteroom", (req, res) => {
  if(socketManager.getUserFromRoom(req.body.room).length === 0){
    gameUtils.setGameStatus(req.body.room, "after");
    const query = {_id: ObjectId(req.body.room)};
    Room.deleteOne(query).then( () => {
      socketManager.getIo().emit("removeRoom", req.body.room);
    });
  };
});


router.get("/roomcode", (req, res) => {
  const query = {_id: req.query.room};

  Room.findOne(query).then((room) => {
    res.send({code: room.code});
  });
});

router.get("/roomstatus", (req, res) => {
  const status = gameUtils.getGameStatus(req.query.room);
  res.send({status: status});
});

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.get("/leaderboard", (req, res) => {
  Run.find().then((run) => {
    res.send(run);
  }).catch((error) => res.send(false));
});

router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  }).catch((error) => res.send(false));
});

router.get("/allUsers", (req, res) => {
  User.find().then((user) => {
    res.send(user);
  }).catch((error) => res.send(false));
});

router.post("/addHighScore", (req, res) => { // pushes the score to the data for a particular user
  const query = {_id: req.body.userId};
  User.findOne(query).then((user) => {
    const newTime = [{ score: gameUtils.getGameTimer()[req.body.room], boardSize: req.body.boardSize }];
    // console.log(JSON.stringify(user));
    if (req.body.boardSize === "small") {
      if (user.topscoreSmall.score === 0) {
        user.topscoreSmall = { score: newTime[0].score, boardSize: req.body.boardSize};
      }
      else if (user.topscoreSmall.score > newTime[0].score) {
        user.topscoreSmall = { score: newTime[0].score, boardSize: req.body.boardSize };
      }
      user.smallTimes = newTime.concat(user.smallTimes);
      user.smallTtimes = user.smallTimes.sort((a,b) => {
        a.score > b.score;
      });
    }
    else if (req.body.boardSize === "medium") {
      if (user.topscoreMedium.score === 0) {
        user.topscoreMedium = { score: newTime[0].score, boardSize: req.body.boardSize};
      }
      else if (user.topscoreMedium.score > newTime[0].score) {
        user.topscoreMedium = { score: newTime[0].score, boardSize: req.body.boardSize };
      }
      user.mediumTimes = newTime.concat(user.mediumTimes);
      // console.log(`here is user.times 1 ${user.times}`);
      user.mediumTimes = user.mediumTimes.sort((a,b) => {
        a.score > b.score;
      });
    }
    else if (req.body.boardSize === "large") {
      if (user.topscoreLarge.score === 0) {
        user.topscoreLarge = { score: newTime[0].score, boardSize: req.body.boardSize};
      }
      else if (user.topscoreLarge.score > newTime[0].score) {
        user.topscoreLarge = { score: newTime[0].score, boardSize: req.body.boardSize };
      }
      user.largeTimes = newTime.concat(user.largeTimes);
      user.largeTimes = user.largeTimes.sort((a,b) => {
        a.score > b.score;
      });
    }
    // if (user.topscore.score === 0) {
    //   user.topscore = { score: newTime[0].score, boardSize: req.body.boardSize};
    // }
    // else if (user.topscore.score > newTime[0].score) {
    //   user.topscore = { score: newTime[0].score, boardSize: req.body.boardSize };
    // }
    // user.times = newTime.concat(user.times);
    // // console.log(`here is user.times 1 ${user.times}`);
    // user.times = user.times.sort((a,b) => {
    //   console.log(`${a.score} and then ${b.score}`);
    //   a.score > b.score;
    // });
    // console.log(`here is user.times 2 ${user.times}`);

    user.save();

    const newRun = new Run({
      userid: user._id,
      username: user.name,
      score: (gameUtils.getGameTimer()[req.body.room])/1000,
    });
  
    newRun.save();
  });
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

router.get("/chat", (req, res) => {
  const query = { "recipient._id": "ALL_CHAT" };
  Message.find(query).then((messages) => res.send(messages));
});

router.post("/message", auth.ensureLoggedIn, (req, res) => {
  console.log(`Received a chat message from ${req.user.name}: ${req.body.content}`);

  // insert this message into the database
  const message = new Message({
    recipient: req.body.recipient,
    sender: {
      _id: req.user._id,
      name: req.user.name,
    },
    content: req.body.content,
  });
  message.save();
  socketManager.getIo().emit("message", message);
});

router.get("/activeUsers", (req, res) => {
  res.send({ activeUsers: socketManager.getAllConnectedUsers() });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
