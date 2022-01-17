import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import Game from "./pages/Game.js";
import NavBar from "./modules/NavBar.js";
import Profile from "./pages/Profile.js";
import ProfileNoExist from "./pages/ProfileNoExist.js";
import Chatbook from "./pages/Chatbook.js";
import Leaderboard from "./pages/Leaderboard.js";
import PlayRoom from "./pages/PlayRoom.js";
import { Link } from "@reach/router";


import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);
  const [userName, setUserName] = useState(undefined);
  const [roomList, setRoomList] = useState([]); // initializes a list of rooms

  

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
        setUserName(user.name);
      }
    });
  }, []);

  const handleLogin = (res) => { //changed from original
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      // the server knows we're logged in now
      setUserId(user._id);
      setUserName(user.name);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => { //changed from original
    console.log("Logged out successfully!");
    setUserId(null);
    setUserName(null);
    post("/api/logout");
  };

  useEffect(() => { // gets the Room ID's from the API
    get("/api/room").then((roomObjs) => {
      let reversedRoomObjs = roomObjs.reverse();
      setRoomList(reversedRoomObjs);
    });
  }, []);

  
  const activeRoomCallback = (data) => {
    console.log("bruh");
    console.log(roomList);
    setRoomList([data].concat(roomList));
    // setRoomList(roomList);
    console.log(`here is roomList: ${JSON.stringify(roomList)} and here is the new data: ${JSON.stringify(data)} and here is the concat: ${JSON.stringify(roomList.concat([data]))}`);
  };
  useEffect(() => { // socket updates rooms when rooms are created
    socket.on("activeRoom", activeRoomCallback);
    return () => {
      socket.off("activeRoom", activeRoomCallback);
    };
  }, [roomList]);

  const addNewRoom = (roomObj) => { // function for adding a room, this gets passed all the way down though
    setRoomList([roomObj].concat(roomList));
  };

  const roomsList = roomList.map((roomObj) => ( // Creates the list of rooms that we can put into our router
    // <Room _id={roomObj._id} /> 
    <PlayRoom
      path={"/room/" + roomObj._id}
      _id={roomObj._id}
      name={roomObj.name}
      key="{roomObj._id}"
      userId={userId}
      userName={userName}/>
    // routes to a page with ending = _id     "/room/:roomObj.roomId"
    // eventually the room should have some data passed into it
    // do we need an await here so that the page is loaded before you can go?
  ));

  return (
    <>
      {/* <NavBar
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        userId={userId}
        /> */}
      <Router> 
        <Skeleton 
          path="/"
    //      roomLinks={roomLinks}
          roomList = {roomList}
          addNewRoom={addNewRoom}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          userName={userName}/>
        {/* <Game 
          path="/game"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          userName={userName}
          /> */}
        <Profile
          path="/profile/:userId"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          userName={userName}/>
        <ProfileNoExist
          path="/profile"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          userName={userName}/>
        
        <Chatbook path="/chat/" userId={userId}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          userName={userName}/>
        <Leaderboard path="/leaderboard/"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          userName={userName}/>
        <NotFound default
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          userName={userName}/>
        {roomsList}
      </Router>
    </>
  );
};

export default App;
