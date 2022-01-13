import React from "react";
import Board from "../modules/Board";
import NavBar from "../modules/NavBar.js";

import "../../utilities.css";
import "./Skeleton.css";
import "./Game.css";

const Game = (props) => {
    return (
      <>
        <NavBar
          handleLogin={props.handleLogin}
          handleLogout={props.handleLogout}
          userId={props.userId}
          />
        <div className="game-board"> 
          <Board height={16} width={30} mines={99} />
        </div>
      </>
    );
  };

export default Game;