import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import Board from "../modules/Board.js";
import { socket } from "../../client-socket.js";
import { post } from "../../utilities";
import ProgressBars from "../modules/ProgressBars.js"
import { Link } from "@reach/router";
import Chat from "../modules/Chat.js";
import NavBar from "../modules/NavBar.js"

import "../../utilities.css";
import "./PlayRoom.css";
import "./Game.css"

/* PropTypes
* String _id, gives the id of the room
* PlayRoom should take in a HOST
*/

const ALL_CHAT = {
  _id: "ALL_CHAT",
  name: "ALL CHAT",
};

const PlayRoom = (props) => {
  useEffect(() => {
    console.log(props._id);
    const body = {roomId: props._id, socketid: socket.id};
    post("/api/joinroom", body);
  }, []);

  const [progressValues, setprogressValues] = useState(null);
  // const dummyProgress = [{username: "vishaal", progress: 98}];
  useEffect(() => {
    // const dummyProgress = [{username: "vishaal", progress: 28}, {username: "boomer", progress: 98}];
  
    const dummyProgress = [2,3,4];
    // setprogressValues([...dummyProgress]);
    setprogressValues(dummyProgress);
  }, []);

  const [userList, setUserList] = useState([]);
  
  const [activeChat, setActiveChat] = useState({
    recipient: ALL_CHAT,
    messages: [],
  });

  const loadMessageHistory = (recipient) => {
    get("/api/chat", { recipient_id: recipient._id }).then((messages) => {
      setActiveChat({
        recipient: recipient,
        messages: messages,
      });
    });
  };

  const addMessages = (data) => {
    setActiveChat(prevActiveChat => ({
      recipient: prevActiveChat.recipient,
      messages: prevActiveChat.messages.concat(data),
    }));
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

  if (!props.userId) {
    return (
    <>
    <NavBar
      handleLogin={props.handleLogin}
      handleLogout={props.handleLogout}
      userId={props.userId}
    />
    <h3>Please log in before using Multimine</h3>

    </>
    );
  }

  useEffect(() => {
    const addUserToRoomList = (userList) => {
      setUserList(userList);
    };
    socket.on("roomupdate", addUserToRoomList);
    return () => {
      socket.off("roomupdate", addUserToRoomList);
    };
  }, []);
  
  return (
    <>
      <div>
      <div className="u-flex u-flex-justifyCenter"> {/* for more styling eventually*/}
        <h1 className="Profile-name u-textCenter">Room ID: {props._id}</h1>
        <Link to="/">
          <button type="button" className="leaveRoomButton">
          Leave Room
          </button>
          </Link>
        
        </div>
      
        <div className ="u-flex">
        <div className="game-board">
          <Board height={16} width={30} mines={99} />
        </div>
        <div className="progressBars"> {/* for more styling eventually*/}
          <ProgressBars progressValues={progressValues} userList={userList}/>
          {/* Will pass in info from sockets to get progress from other players */}
          {/* should actually be to the right of the board */}
        </div>
        {/* <div>
          This is the user list:
          {userList}
        </div> */}

        </div>
        <div>
          <Chat data={activeChat}/>
        </div>
      </div>
    </>
  );
};

export default PlayRoom;
