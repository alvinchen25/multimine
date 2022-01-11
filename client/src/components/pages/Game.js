import React from "react";
import Board from "../modules/Board";

import "../../utilities.css";
import "./Skeleton.css";
import "./Game.css";

const Game = () => {
    return (
      <>
        <div className="game-board"> 
          <Board height={16} width={30} mines={99} />
        </div>
      </>
    );
  };

export default Game;