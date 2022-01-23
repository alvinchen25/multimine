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

  const sizeChange = (event) => {
    props.setBoardSize(event.target.value);
  }

  // called when the user hits "Submit" for a new post
  const handleSubmit = (event) => {
    event.preventDefault();
    // props.onSubmit(value);
    props.onSubmit && props.onSubmit(value);
    setValue("");
  };

  const handleCheck = (event) => {
    // event.preventDefault();
    props.setRoomPrivate(!props.roomPrivate);
  };

  const keyDown = (event) => {
    if (event.key === "Enter" ) {
      props.onSubmit && props.onSubmit(value);
      setValue("");
    }
  };

  return (
    <>
      <h2>Create a room</h2>
      
      <div>
        Private game?
        <input type = "checkbox" className="checkbox" onChange={handleCheck} checked={props.roomPrivate}/>
      </div>
      <div>
        Game size?
        <form className="u-flex" onChange={sizeChange} method="post" action="">
          <div><input type="radio" name="size" value="large" defaultChecked/>Large: 16x30, 99 mines</div>
          <div><input type="radio" name="size" value="medium"/>Medium 16x16, 40 mines</div>
          <div><input type="radio" name="size" value="small"/>Small 9x9, 10 mines</div>
        </form>
      </div>
      <div className="u-flex">
        <input
          type="text"
          placeholder={props.defaultText}
          value={value}
          onChange={handleChange}
          onKeyDown={keyDown} 
          className="NewPostInput-input"
          maxLength={20}
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
    </>
  );
};

/**
 * New Room creates a new room
 *
 * Proptypes
 * @param {function} addNewRoom
 */
const NewRoom = (props) => {
  const [roomPrivate, setRoomPrivate] = useState(false);
  const [boardSize, setBoardSize] = useState("large");

  const AddRoom = (value) => {
    const body = { name: value, isPrivate: roomPrivate, boardSize: boardSize };
    post("/api/room", body).then((room) => {
      props.addNewRoomHost(room._id);
    });
  };

  return (
    <>
      <NewPageInput defaultText="Enter room name to create room" onSubmit={AddRoom} setRoomPrivate={setRoomPrivate} setBoardSize={setBoardSize} roomPrivate={roomPrivate} />
    </>
  );
  //What will the props be?
}

export { NewRoom };