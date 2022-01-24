import React, { useState, useEffect } from "react";

import "./SingleMessage.css";

/**
 * Renders a single chat message
 *
 * Proptypes
 * @param {MessageObject} message
 */
const SingleMessage = (props) => {
  return (
    // <div className={"u-flex u-flex-alignCenter SingleMessage-container"}>
    <>
      <div className="messageyeet">
      <b>{props.message.sender.name}</b>: {props.message.content}
      </div>
      {/* <span className=" SingleMessage-sender u-bold">{props.message.sender.name + ":"}</span>
      <span className="SingleMessage-content">{props.message.content}</span> */}
    </>
  );
}

export default SingleMessage;