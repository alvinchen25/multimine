
import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import Board from "../modules/Board.js";

import "../../utilities.css";
import "./Profile.css";
import "./Game.css"
// prop: _id of the room

const PlayRoom = (props) => {
  
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
