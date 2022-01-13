import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import Board from "../modules/Board.js";
import { socket } from "../../client-socket.js";
import { post } from "../../utilities";
import ProgressBars from "../modules/ProgressBars.js"

import "../../utilities.css";
// import "./PlayRoom.css";
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
  
  useEffect(() => {
    // const dummyProgress = [{username: "vishaal", progress: 28}, {username: "boomer", progress: 98}];
    const dummyProgress = [2,3,4];
    setprogressValues(dummyProgress);
  }, []);
  
  return (
    <>
      <div>
        <h1 className="Profile-name u-textCenter">Room ID: {props._id}</h1>
        <div className="game-board">
          <Board height={16} width={30} mines={99} />
        </div>
        <div>
          <ProgressBars progressValues={progressValues}/>
          {/* Will pass in info from sockets to get progress from other players */}
          {/* should actually be to the right of the board */}
        </div>
      </div>
    </>
  );
};

export default PlayRoom;
