import React, { useEffect, useState } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { NewRoom } from "../modules/NewPageInput";
import NavBar from "../modules/NavBar.js"
import { useNavigate } from "@reach/router";
import CodePopup from "../modules/CodePopup.js";
import { socket } from "../../client-socket.js";
import { get } from "../../utilities"
import { Link } from "@reach/router";
import Chat from "../modules/Chat.js";

import "../modules/Chat.css";
import "../../utilities.css";
import "./Skeleton.css";

/* propTypes
* @param addNewRoom
*/

const ALL_CHAT = {
  _id: "ALL_CHAT",
  name: "Global Chat",
};

const Skeleton = (props) => {
  const [askCode, setAskCode] = useState({});
  const [activeChat, setActiveChat] = useState({
    recipient: ALL_CHAT,
    messages: [],
  });


  const addMessages = (data) => {
    setActiveChat(prevActiveChat => ({
      recipient: prevActiveChat.recipient,
      messages: prevActiveChat.messages.concat(data),
    }));
  };

  const loadMessageHistory = (recipient) => {
    get("/api/chat", { recipient_id: recipient._id }).then((messages) => {
      setActiveChat({
        recipient: recipient,
        messages: messages,
      });
    });
  };

  useEffect(() => {
    document.title = "Multimine";
  }, []);

  useEffect(() => {
    loadMessageHistory(ALL_CHAT);
  }, []);

  useEffect(() => {
    socket.on("message", addMessages);
    return () => {
      socket.off("message", addMessages);
    };
  }, []);

  const navigate = useNavigate();

  const togglePopup = (room) => {
    if(!props.userId){
      return;
    }
    if (room.status === "In progress") {
      return;
    }
    const newAskCode = {...askCode};
    if(askCode[room._id]){
      newAskCode[room._id] = false;
    }else{
      newAskCode[room._id] = true;
    }
    setAskCode(newAskCode);
  }

  const checkCode = (code, room) => {
    get("/api/roomcode", {room: room}).then((trueCode) => {
      if(code === trueCode.code){
        navigate("/room/"+room);
      }
    });
  }

  const enterRoom = (room) => {
    if(!props.userId){
      return;
    }
    if (room.status === "In progress") {
      return;
    }
    navigate("/room/"+room._id);
  }

  const addNewRoomHost = (room) => {
    navigate("/room/"+room);
  };

  const roomLinks = props.roomList.map((roomObj) => ( // maps the ID liist into links with the ids
    (roomObj.isPrivate === true) ? (
      <div>
        <button onClick = {() => togglePopup(roomObj)}  className="u-link minesweeperButton"> {/* So if we want the link to be the roomId, we would just replace _id with roomId. I won't do that yet because it would cause duplicates */}
          <h3>{roomObj.name}</h3>
          <h5>{roomObj.status}</h5>
          <h5>{roomObj.boardSize}</h5>
          <h5>private</h5>
        </button>
        {askCode[roomObj._id] && <CodePopup room = {roomObj._id} handleClose = {() => togglePopup(roomObj)} checkCode = {checkCode}/>}
      </div>
    ) : (
      <div>
        <button  className="u-link minesweeperButton" onClick = {() => enterRoom(roomObj)}>
          <h3>{roomObj.name}</h3>
          <h5>{roomObj.status}</h5>
          <h5>{roomObj.boardSize}</h5>
          <h5>public</h5>
        </button>
      </div>
    )
  ));

  return (
    <>
      <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        logStable={true}
        />
    <div className="lobbyPage u-flex">

      {(props.userId) ? (<div className="createRoom" >
        <NewRoom addNewRoomHost = {addNewRoomHost} />
      </div>) : (
      <div className="createRoom" >
      <h2>
        Log in to create and join a room!
      </h2>
      </div>)}

    <div className="lobbyBox">
    {/* <h1>Lobby</h1> */}
      <div className="roomCount">
        <h2>Number of active rooms: {roomLinks.length}</h2>
        <div className="minesweeperButtonContainer">
        {roomLinks}
        </div>
      </div>
        </div>

        <div className="lobbyChat u-flex u-relative Chatbook-container">
          <div className="Chatbook-chatContainer u-relative">
            <Chat data={activeChat} userId={props.userId}/>
          </div>
        </div>

      </div>
    </>
  );
};

export default Skeleton;



