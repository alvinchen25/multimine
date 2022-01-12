// THIS IS A USELESS FILE I'M JUST KEEPING IT HERE FOR KICKS
import React, { useState, useEffect } from "react";
import { get } from "../../utilities"
import Room from "./PlayRoom.js"
import { NewRoom } from "../modules/NewPageInput";

import "../../utilities.css";
import "./Profile.css";

const Roomlist = () => {
    const [roomIDlist, setroomIDlist] = useState([]);

//   useEffect(() => {
//     document.title = "Profile Page";
//     get(`/api/user`, { userid: props.userId }).then((userObj) => setUser(userObj));
//   }, []);
  useEffect(() => {
    get("/api/room").then((roomObjs) => {
      // let reversedStoryObjs = storyObjs.reverse();
      setroomIDlist(roomObjs);
    });
  }, []);

  const addNewRoom = (roomObj) => {
    setroomIDlist([roomObj].concat(roomIDlist));
  };

  useEffect(() => {
      const dumbarray = ["one", "two", "three"];
      const newarray = dumbarray.map((elephent) => (
          {
              _id: {elephent}
          }
      ));
      setroomIDlist(newarray);
  }, [] );
// somehow well have room id list
  const roomsList = roomIDlist.map((roomObj) => (
    // <Room _id={roomObj._id} /> 
    <Room path="/room/:roomObj._id" _id={roomObj._id} key={roomObj._id}/>
    // routes to a page with ending = _id
  ));
  return (
    <>
      <NewRoom addNewRoom = {addNewRoom} />
      {roomsList}
    </>
  );
};

export default Roomlist;
