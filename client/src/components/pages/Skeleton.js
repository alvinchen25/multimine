import React, { Component, useState } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { NewRoom } from "../modules/NewPageInput";
import NavBar from "../modules/NavBar.js"
import { useNavigate } from "@reach/router";
import CodePopup from "../modules/CodePopup.js";
import { get } from "../../utilities"
import { Link } from "@reach/router";

import "../../utilities.css";
import "./Skeleton.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID --> DONE
// const GOOGLE_CLIENT_ID = "476771463106-5p85qlaqfetmh67l5bmn4394k0nl9aoi.apps.googleusercontent.com";

/* propTypes
* @param addNewRoom
*/

const Skeleton = (props) => {
  const [askCode, setAskCode] = useState({});

  const navigate = useNavigate();

  const togglePopup = (room) => {
    if(!props.userId){
      return;
    }
    const newAskCode = {...askCode};
    if(askCode[room]){
      newAskCode[room] = false;
    }else{
      newAskCode[room] = true;
    }
    setAskCode(newAskCode);
  }

  const checkCode = (code, room) => {
    get("/api/roomcode", {room: room}).then((trueCode) => {
      console.log(`True code is ${trueCode.code}`);
      if(code === trueCode.code){
        navigate("/room/"+room);
      }
    });
  }

  const enterRoom = (room) => {
    if(!props.userId){
      return;
    }
    navigate("/room/"+room);
  }

  const addNewRoomHost = (room) => {
   // props.addNewRoom(room);
    navigate("/room/"+room);
  };



  const roomLinks = props.roomList.map((roomObj) => ( // maps the ID liist into links with the ids
    (roomObj.isPrivate === true) ? (
      <div>
      <button onClick = {() => togglePopup(roomObj._id)}  className="u-link minesweeperButton"> {/* So if we want the link to be the roomId, we would just replace _id with roomId. I won't do that yet because it would cause duplicates */}
        <h3>{roomObj.status}</h3>
        <h5>Private Room:</h5>
        <h3>{roomObj.name}</h3>
      </button>
        {askCode[roomObj._id] && <CodePopup room = {roomObj._id} handleClose = {() => togglePopup(roomObj._id)} checkCode = {checkCode}/>}
      </div>
    ) : (
      <div>
        <button  className="u-link minesweeperButton" onClick = {() => enterRoom(roomObj._id)}>
          <h3>{roomObj.status}</h3>
          <h5>Public Room:</h5>
          <h3>{roomObj.name}</h3>
        </button>
      </div>
    )
  ));
  // const roomLinksNotLoggedIn = props.roomList.map((roomObj) => ( // maps the ID liist into links with the ids
  //   (roomObj.isPrivate === true) ? (
  //     <div>
  //     <button className="u-link minesweeperButton"> {/* So if we want the link to be the roomId, we would just replace _id with roomId. I won't do that yet because it would cause duplicates */}
  //       <h3>{roomObj.status}</h3>
  //       <h5>Private Room:</h5>
  //       <h3>{roomObj.name}</h3>
  //     </button>
  //       {askCode[roomObj._id] && <CodePopup room = {roomObj._id} handleClose = {() => togglePopup(roomObj._id)} checkCode = {checkCode}/>}
  //     </div>
  //   ) : (
  //     <div>
  //      {/* So if we want the link to be the roomId, we would just replace _id with roomId. I won't do that yet because it would cause duplicates */}
  //       <button  className="u-link minesweeperButton">
  //         <h3>{roomObj.status}</h3>
  //         <h5>Public Room:</h5>
  //         <h3>{roomObj.name}</h3>
  //       </button>
  //     </div>
  //   )
  // ));

  return (
    <>
    <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        logStable={true}
        />
    <div className="lobbyBox">
    <h1>Multimine</h1>
      
      {(props.userId) ? (<div>
        <NewRoom addNewRoomHost = {addNewRoomHost} />
      </div>) : (<h2>
        Log in to create and join a room!
      </h2>)}
      <div className="roomCount">
        <h3>Number of rooms open: {roomLinks.length}</h3>
        <div className="minesweeperButtonContainer">
        {roomLinks}
        </div>
      </div>

    </div>
    </>
  );
};

export default Skeleton;



