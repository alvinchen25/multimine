import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import Board from "../modules/Board.js";
import { socket } from "../../client-socket.js";
import { post } from "../../utilities";
import ProgressBars from "../modules/ProgressBars.js"
import { Link } from "@reach/router";
import Chat from "../modules/Chat.js";

import "../../utilities.css";
import "./PlayRoom.css";
import "./Game.css"
/* PropTypes
* String _id, gives the id of the room
* PlayRoom should take in a HOST
*/

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
        <div> {/* for more styling eventually*/}
        <h1 className="Profile-name u-textCenter">Room ID: {props._id}</h1>
        <Link to="/">
          <button type="button" className="leaveRoomButton">
          Leave Room
          </button>
          </Link>
        
        </div>
      
        
        <div className="game-board">
          <Board height={16} width={30} mines={99} />
        </div>
        <div>
          {/* <ProgressBars progressValues={progressValues}/> */}
          {/* Will pass in info from sockets to get progress from other players */}
          {/* should actually be to the right of the board */}
        </div>
        <div>
          This is the user list:
          {userList}
        </div>
        <div>
          {/* <Chat/> */}
        </div>
      </div>
    </>
  );
};

export default PlayRoom;
