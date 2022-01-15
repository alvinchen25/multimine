import React, { useState, useEffect } from "react";
import { get } from "../../utilities"
import NavBar from "../modules/NavBar.js"

import "../../utilities.css";
import "./Leaderboard.css";

const Leaderboard = (props) => {

  return (
    <>
      <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        />
      <div>
        This will be the leaderboard.
      </div>
    </>
  );
};

export default Leaderboard;
