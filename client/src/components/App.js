import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import Game from "./pages/Game.js";
import NavBar from "./modules/NavBar.js";
import Profile from "./pages/Profile.js";
import Chatbook from "./pages/Chatbook.js";
// import Roomlist from "./pages/Roomlist.js";
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

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
      }
    });
  }, []);

  const handleLogin = (res) => { //changed from original
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      // the server knows we're logged in now
      setUserId(user._id)
    });
  };

  const handleLogout = () => { //changed from original
    console.log("Logged out successfully!");
    setUserId(null);
    post("/api/logout");
  };

  const [roomIDlist, setroomIDlist] = useState([]); // initializes a list of room ID's

  useEffect(() => { // gets the Room ID's from the API
    get("/api/room").then((roomObjs) => {
      let reversedRoomObjs = roomObjs.reverse();
      setroomIDlist(reversedRoomObjs);
    });
  }, []);

  const addNewRoom = (roomObj) => { // function for adding a room, this gets passed all the way down though
    setroomIDlist([roomObj].concat(roomIDlist));
  };

  // somehow well have room id list
  const roomsList = roomIDlist.map((roomObj) => ( // Creates the list of rooms that we can put into our router
    // <Room _id={roomObj._id} /> 
    <PlayRoom path={"/room/" + roomObj._id} _id={roomObj.roomId} key="{roomObj._id}"/>
    // routes to a page with ending = _id     "/room/:roomObj.roomId"
    // eventually the room should have some data passed into it
    // do we need an await here so that the page is loaded before you can go?
  ));
  const roomLinks = roomIDlist.map((roomObj) => ( // maps the ID liist into links with the ids
    <div>
    <Link to={"/room/"+roomObj._id} className="u-link minesweeperButton"> {/* So if we want the link to be the roomId, we would just replace _id with roomId. I won't do that yet because it would cause duplicates */}
      Enter Room: {roomObj.roomId}
    </Link>
    </div>
  ));

  return (
    <>
      <NavBar
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        userId={userId}
        />
      {/* Maybe have some sort of CSS for the Router */}
      <Router> 
        <Skeleton path="/" roomLinks={roomLinks} addNewRoom={addNewRoom} />
        <Game path="/game"/>
        <Profile path="/profile/:userId"/>
        {/* ^^ is gonna be /useriD */}
        {roomsList}
        <Chatbook path="/chat/" userId={userId} />
        <NotFound default />

      </Router>
    </>
  );
};

export default App;
