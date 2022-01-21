let io;

const socket = require("socket.io-client/lib/socket");
const gameUtils = require("./game-utils.js");
const Room = require("./models/room");
const ObjectId = require('mongodb').ObjectId;

const userToSocketMap = {}; // maps user ID to socket ID
const socketToUserMap = {}; // maps socket ID to userID
const userToRoom = {} //  maps user to room
const roomToUser = {} //  maps room to users

const getAllConnectedUsers = () => Object.values(socketToUserMap);
const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];
const getRoomFromUser = (userid) => userToRoom[userid];
const getUserFromRoom = (room) => roomToUser[room];

const getNamesFromRoom = (room) => {
  let names = [];
  getUserFromRoom(room).map((user) => {
    names.push(user.name);
  });
  return names;
}

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];
  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    io.to(oldSocket).emit("forceDisconnect");
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
  io.emit("activeUsers", { activeUsers: getAllConnectedUsers() });
  
 // console.log("1234");
 // console.log(socketid);
 // console.log(user);
};

const removeUser = (user, socket) => {
  if (user) delete userToSocketMap[user._id];
  delete socketToUserMap[socket.id];
  io.emit("activeUsers", { activeUsers: getAllConnectedUsers() });
};

const addRoom = (user, room) => {
  let oldRoom = getRoomFromUser(user._id);
  if(oldRoom){
    getSocketFromUserID(user._id).leave(oldRoom);

    roomToUser[oldRoom] = roomToUser[oldRoom].filter((thing) => thing._id !== user._id);
  }
  
  console.log(`${user.name} has joined room ${room}`);
  getSocketFromUserID(user._id).join(room);
  
  userToRoom[user._id] = room;
 
  if(roomToUser[room]){
    roomToUser[room].push(user);
  }else{
    roomToUser[room] = [user];
  }

  console.log(`${room} array is now ${roomToUser[room]} with size ${roomToUser[room].length}`);
}

const leaveRoom = (user, room) => {
  if(userToRoom[user._id]){
    getSocketFromUserID(user._id).leave(room);

    console.log(`${user.name} has left room ${room}`);

    roomToUser[room] = roomToUser[room].filter((thing) => thing._id !== user._id);
    console.log(`${room} array is now ${roomToUser[room]} with size ${roomToUser[room].length}`);
    
    delete userToRoom[user._id];
  
  }
}


module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    const updateTimes = () => {
    //  console.log("asdf");
      gameUtils.updateGameTimer();
      const times = gameUtils.getGameTimer();
     // console.log(times);
      for(room in times){
        if(gameUtils.getGameStatus(room) === "during"){
          io.to(room).emit("timeUpdate", times[room]);
        }
      }
    };

    setInterval(updateTimes, 100);



    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        
        if(user){
          if(userToRoom[user._id]){
            room = userToRoom[user._id];
            leaveRoom(user, room);
            io.to(room).emit("roomupdate", getNamesFromRoom(room));

            if(getUserFromRoom(room).length === 0){
              const query = {code: gameUtils.getRoomCode(room)};
              console.log(gameUtils.getRoomCode(room));
              gameUtils.setGameStatus(room, "after");
              Room.deleteOne(query).then(() => {
                io.emit("removeRoom", room);
              });
            }
          }

          removeUser(user, socket.id);
          console.log(`goodbye ${user.name}`);
        }
        
      });


      socket.on("joinroomSock", (room) => {
        const user = getUserFromSocketID(socket.id);
        if(user){
          addRoom(user,room);
          io.to(room).emit("roomupdate", getNamesFromRoom(room));
        }
      });

      socket.on("leaveroomSock", (room) => {
        const user = getUserFromSocketID(socket.id);
        if(user){
          leaveRoom(user,room);
          io.to(room).emit("roomupdate", getNamesFromRoom(room));         
        }
      });

      socket.on("startGame", ({room, height, width, mines}) => {
        const query = {_id: ObjectId(room)};
        Room.findOne(query).then((thing) => {
          thing.status = "In progress";
          thing.save();
          const mineList = gameUtils.initMines(height, width, mines);
          console.log(`in socket: height ${height} width ${width} mines ${mines}`);
          io.to(room).emit("initmines", mineList);
          io.to(room).emit("showgame");
          io.emit("startstatus", room);
          gameUtils.setGameStatus(room, "during");
          gameUtils.setGameTimer(room, 0);
        });  
      });

      socket.on("endGame", ({room, socketid}) => {
        const winner = getUserFromSocketID(socketid);
        const winTime = gameUtils.getGameTimer()[room];
        io.to(room).emit("hidegame", {winner: winner, winTime:winTime});
      });

      socket.on("progressUpdate", ({progress, room}) => {
        io.to(room).emit("newProgressUpdate", {user: getUserFromSocketID(socket.id), progress: progress});
      });

      socket.on("roomMessage", ({message, room}) => {
        console.log(`The message ${message.content} reached the server socket at the room: ${room}`);
        io.to(room).emit("newRoomMessage", message);
      });
    });
  },

  roomToUser: roomToUser,
  addUser: addUser,
  removeUser: removeUser,
  addRoom: addRoom, 
  leaveRoom: leaveRoom, 

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getAllConnectedUsers: getAllConnectedUsers,
  getRoomFromUser: getRoomFromUser, 
  getUserFromRoom: getUserFromRoom,
  getNamesFromRoom: getNamesFromRoom,
  getIo: () => io,
};
