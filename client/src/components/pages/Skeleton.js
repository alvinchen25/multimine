import React, { Component, useState } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import CreateRoom from "../modules/CreateRoom.js";
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

  const addNewRoomHost = (room) => {
   // props.addNewRoom(room);
    navigate("/room/"+room._id);
  };

  const roomLinks = props.roomList.map((roomObj) => ( // maps the ID liist into links with the ids
    (roomObj.isPrivate === true) ? (
      <div>
      <button onClick = {() => togglePopup(roomObj._id)}  className="u-link minesweeperButton"> {/* So if we want the link to be the roomId, we would just replace _id with roomId. I won't do that yet because it would cause duplicates */}
        <h3>{roomObj.name}</h3>
        <h3>Private</h3>
      </button>
        {askCode[roomObj._id] && <CodePopup room = {roomObj._id} handleClose = {() => togglePopup(roomObj._id)} checkCode = {checkCode}/>}
      </div>
    ) : (
      <div>
      <Link to={"/room/"+roomObj._id}> {/* So if we want the link to be the roomId, we would just replace _id with roomId. I won't do that yet because it would cause duplicates */}
        <button  className="u-link minesweeperButton">
          {roomObj.name}
          <h3>Public</h3>
        </button>
      </Link>
      </div>
    )
  ));

  return (
    <>
    <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        />
    <div className="lobbyBox">
    <h1>Welcome to the Multimine Lobby!</h1>
      
      <div>
        <CreateRoom/>
      </div>
      {(props.userId) ? (<div>
        <NewRoom addNewRoomHost = {addNewRoomHost} />
      </div>) : (<div>
        Log in to create and join a room!
      </div>)}
      <div className="roomCount">
        <h2>Number of rooms open: {roomLinks.length}</h2>
        <h3>Click below to enter a room!</h3>
        <div className="minesweeperButtonContainer">
        {roomLinks}
        </div>
      </div>

    </div>

    <div className="rulesBox">
      {/* edit but include this somewhere */}
      <h1> How To Play Minesweeper: *edit later* </h1>
      <h3> You will be presented with a rectangular board of square tiles! Some of the tiles cover mines (picture), 
        and your goal will be to deduce and uncover all the squares without mines! </h3>
      <h3> A right click will uncover the clicked tile. If this tile is empty, it will expose all of the adjacent empty 
        tiles. The uncovered tiles may also display a number from 1-8 (picture), which represents the number of mines in the 8 tiles adjacent to the square.
        Right click will flag and unflag tiles that you think are potential mines.
      </h3>
      <h3>Unlike the original minesweeper, clicking on a mine will not lead to your loss, but a preset time delay
        for each game.
      </h3>
    </div>
    </>
  );
};

export default Skeleton;



