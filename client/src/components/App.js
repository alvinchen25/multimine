import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import Gameplay from "./pages/Gameplay.js";
import NavBar from "./modules/NavBar.js";
import Profile from "./pages/Profile.js";
import Chatbook from "./pages/Chatbook.js";
import Roomlist from "./pages/Roomlist.js";
import Room from "./pages/Room.js";

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
      setUserId(user._id);
      console.log(user);
    });
  };

  const handleLogout = () => { //changed from original
    console.log("Logged out successfully!");
    setUserId(null);
    post("/api/logout");
  };

  const [roomIDlist, setroomIDlist] = useState([]);

//   useEffect(() => {
//     document.title = "Profile Page";
//     get(`/api/user`, { userid: props.userId }).then((userObj) => setUser(userObj));
//   }, []);
  useEffect(() => {
      const dumbarray = ["one", "two", "three"];
      const newarray = dumbarray.map((elephent) => (
          {
              _id: elephent
          }
      ));
      setroomIDlist(newarray);
  }, [] );
  // somehow well have room id list
  const roomsList = roomIDlist.map((roomObj) => (
    // <Room _id={roomObj._id} /> 
    <Room path={"/room/" + roomObj._id} _id={roomObj._id} key="{roomObj._id}"/>
    // routes to a page with ending = _id     "/room/:roomObj._id"

  ));
  //console.log(roomsList);

  return (
    <>
      <NavBar
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        userId={userId}
        />
      {/* Maybe have some sort of CSS for the Router */}
      <Router> 
        <Skeleton path="/" />
        {/* <Skeleton path="/" handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} /> */}
        <Gameplay path="/game"/>
        <Profile path="/profile/:userId"/>
        {/* ^^ is gonna be /useriD */}
        {/* <Room path="/room/:roomID"/> */}
        {/* <Roomlist path = "/room"/> */}
        {roomsList}
        <Chatbook path="/chat/" userId={userId} />
        <NotFound default />

      </Router>
    </>
  );
};

export default App;
