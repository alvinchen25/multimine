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
      <h1> How To Play Multimine! </h1>
      <h2> Q: I've never played minesweeper before. What are the basic rules and strategy for the game?</h2>
      <h3> A: <a href="https://minesweepergame.com/strategy.php">See this resource!</a></h3>
      <h2> Q: How is Multimine different from typical minesweeper?</h2>
      <h3> A: All players in the same room have the <i>same layout</i> of mines. If you click on a mine, the game is <i>not over</i>. Instead, your board freezes for a few seconds as a penalty.</h3>
      <h2> Q: Why is one square different in the beginning? </h2>
      <h3> A: This square is an <i>interior square</i>. Typically in Minesweeper, your first clicked square is guaranteed to be an interior square. Since multiple people are playing with the same layout, we provide one interior square to start from. You are not <i>required</i> to click on it, but it usually helps!</h3>
      <h2> Q: What do the colors in the progress bars mean? </h2>
      <h3> A: Green means that the player is currently playing as normal. Blue means that they are frozen, having just clicked on a mine. Purple means they have completed the game!</h3>
      {/* <h3> You will be presented with a rectangular board of square tiles! Some of the tiles cover mines (picture), 
        and your goal will be to deduce and uncover all the squares without mines! </h3>
      <h3> A left click on an uncovered tile will uncover the clicked tile. If this tile is empty, it will expose all of the adjacent empty 
        tiles. The uncovered tiles may also display a number from 1-8 (picture), which represents the number of mines in the 8 tiles adjacent to the square.
        A right click will flag and unflag tiles that you think are potential mines.
      </h3>
      <h3> It's also possible to click on an uncovered numbered square, if one has flagged all adjacent mines. If the number of flagged adjacent
         squares is equal to the number inside the square, then clicking on the numbered square will reveal all uncovered non-flagged adjacent squares.</h3> */}
    </div>
    </>
  );
};

export default Howtoplay;
