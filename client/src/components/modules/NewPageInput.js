import React, { useState } from "react";

import "./NewPostInput.css"; // Maybe change this css at some point
import { post } from "../../utilities";

/**
 * New Page is a parent component for all page components
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 * @param {string} storyId optional prop, used for comments
 * @param {({storyId, value}) => void} onSubmit: (function) triggered when this post is submitted, takes {storyId, value} as parameters
 * @param {} onSubmit
 */
const NewPageInput = (props) => {
  const [value, setValue] = useState("");

  // called whenever the user types in the new post input box
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // called when the user hits "Submit" for a new post
  const handleSubmit = (event) => {
    event.preventDefault();
    // props.onSubmit(value);
    props.onSubmit && props.onSubmit(value);
    setValue("");
  };

  return (
    <div className="u-flex">
      <input
        type="text"
        placeholder={props.defaultText}
        value={value}
        onChange={handleChange}
        className="NewPostInput-input"
      />
      <button
        type="submit"
        className="NewPostInput-button u-pointer"
        value="Submit"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

/**
 * New Room creates a new room
 *
 * Proptypes
 * @param {function} addNewRoom
 */
const NewRoom = (props) => {
  const AddRoom = (value) => {
    const body = { roomIDval: value };
    post("/api/room", body).then((room) => {
        // display this story on the screen
        props.addNewRoom(room);
    });
  };

  return <NewPageInput defaultText="this is supposed to create a room" onSubmit={AddRoom}/>;
  //What will the props be?
}

export { NewRoom };