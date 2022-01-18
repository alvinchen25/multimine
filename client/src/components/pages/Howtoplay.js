import React, { useState, useEffect } from "react";
import { get } from "../../utilities"
import NavBar from "../modules/NavBar.js"

import "../../utilities.css";
import "./Howtoplay.css";

const Howtoplay = (props) => {

  return (
    <>
      <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        logStable={true}
        />
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

export default Howtoplay;
