import React, { useState, useEffect } from "react";
import { get } from "../../utilities"
import NavBar from "../modules/NavBar.js"

import "../../utilities.css";
import "./Profile.css";

const ProfileNoExist = (props) => {

  return (
    <>
      <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        />
      <div>
        <h1 className="Profile-name u-textCenter">That Profile was not found!</h1>
      </div>
    </>
  );
};

export default ProfileNoExist;
