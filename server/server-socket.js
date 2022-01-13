let io;

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

const addUser = (user, socketid) => {
  const oldSocket = userToSocketMap[user._id];
  if (oldSocket && oldSocket != socketid) {
    // there was an old tab open for this user, force it to disconnect
    io.to(oldSocket).emit("forceDisconnect");
    delete socketToUserMap[oldSocket];
  }

  userToSocketMap[user._id] = socketid;
  socketToUserMap[socketid] = user;
  io.emit("activeUsers", { activeUsers: getAllConnectedUsers() });
};

const removeUser = (user, socketid) => {
  if (user) delete userToSocketMap[user.id];
  delete socketToUserMap[socketid];
  io.emit("activeUsers", { activeUsers: getAllConnectedUsers() });
};

const addRoom = (user, room) => {
  let oldRoom = getRoomFromUser(user._id);
  if(oldRoom){
    getSocketFromUserID(user._id).leave(room);

    roomToUser[oldRoom] = roomToUser[oldRoom].filter((thing) => thing._id != user._id);
    console.log(`${user.name} has left ${oldRoom}`);
  }
  
 

  getSocketFromUserID(user._id).join(room);
  console.log(`${user.name} has joined ${room}`);
  
  userToRoom[user._id] = room;
  if(roomToUser[room]){
    roomToUser[room].push(user);
  }else{
    roomToUser[room] = [user];
  }
  
  
}

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket.id);
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,
  addRoom: addRoom, 

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getAllConnectedUsers: getAllConnectedUsers,
  getRoomFromUser: getRoomFromUser, 
  getUserFromRoom: getUserFromRoom,
  getNamesFromRoom: getNamesFromRoom,
  getIo: () => io,
};
