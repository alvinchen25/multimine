import React from "react";
import Board from "../modules/Board";

import "../../utilities.css";
import "./Skeleton.css";

const Gameplay = () => {
    return (
      <>
        <Board height={16} width={30} mines={99} />
      </>
    );
  };

export default Gameplay;