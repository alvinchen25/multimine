import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import CreateRoom from "../modules/CreateRoom.js";
import { NewRoom } from "../modules/NewPageInput";
import NavBar from "../modules/NavBar.js"


import "../../utilities.css";
import "./Skeleton.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID --> DONE
// const GOOGLE_CLIENT_ID = "476771463106-5p85qlaqfetmh67l5bmn4394k0nl9aoi.apps.googleusercontent.com";

/* propTypes
* @param [String] roomLinks
* @param addNewRoom
*/

const Skeleton = (props) => {
  return (
    <>
    <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        />
    <div className="lobbyBox">
    <h1>Welcome to the Multimine Lobby!</h1>
      
      <h1>Helloooo :O</h1>
      <div>
        <CreateRoom/>
      </div>
      <div>
        <NewRoom addNewRoom = {props.addNewRoom} />
      </div>
      <div className="roomCount">
        <h2>Number of rooms open: {props.roomLinks.length}</h2>
        <h3>Click below to enter a room!</h3>
        <div className="minesweeperButtonContainer">
        {props.roomLinks}
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
