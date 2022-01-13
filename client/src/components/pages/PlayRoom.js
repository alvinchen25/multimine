import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import Board from "../modules/Board.js";
import { socket } from "../../client-socket.js";
import { post } from "../../utilities";

import "../../utilities.css";
import "./Profile.css";
import "./Game.css"
/* PropTypes
* String _id, gives the id of the room
*
*/

const PlayRoom = (props) => {
  useEffect(() => {
    post("/api/joinroom", {roomId: props._id, socketid: socket.id});
  }, []);

  
  return (
    <>
      <div>
        <h1 className="Profile-name u-textCenter">Room ID: {props._id}</h1>
        <div className="game-board">
          <Board height={16} width={30} mines={99} />
        </div>
      </div>
    </>
  );
};

export default PlayRoom;
