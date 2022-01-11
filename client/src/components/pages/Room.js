
import React, { useState, useEffect } from "react";
import { get } from "../../utilities"

import "../../utilities.css";
import "./Profile.css";
// prop: _id of the room

const Room = (props) => {
  
  return (
    <>
      <div>
      <h1 className="Profile-name u-textCenter">{props._id}</h1>
      </div>
    </>
  );
};

export default Room;
