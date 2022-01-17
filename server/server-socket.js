let io;

const {initMines} = require("./game-utils.js");

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
  if (oldSocket && oldSocket.id != socket.id) {
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

    roomToUser[oldRoom] = roomToUser[oldRoom].filter((thing) => thing._id != user._id);
  }
  
  console.log(`${user.name} has joined room ${room}`);
  getSocketFromUserID(user._id).join(room);
  
  userToRoom[user._id] = room;
  if(roomToUser[room]){
    roomToUser[room].push(user);
  }else{
    roomToUser[room] = [user];
  }
}

const leaveRoom = (user, room) => {
  if(userToRoom[user._id]){
    getSocketFromUserID(user._id).leave(room);

    console.log(`${user.name} has left room ${room}`);

    roomToUser[room] = roomToUser[room].filter((thing) => thing._id != user._id);
    delete userToRoom[user._id];
  
  }
}


module.exports = {

  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        
        if(user){
          if(userToRoom[user._id]){
            room = userToRoom[user._id];
            leaveRoom(user, room);
            io.to(room).emit("roomupdate", getNamesFromRoom(room));
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

      socket.on("startGame", (room) => {
        const mineList = initMines();
        io.to(room).emit("initmines", mineList);
        io.to(room).emit("showgame");

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
