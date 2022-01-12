import React, { useState } from "react";

import "./NewPostInput.css";
import { post } from "../../utilities";

/**
 * New Post is a parent component for all input components
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
 * New Comment is a New Post component for comments
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 * @param {string} storyId to add comment to
 */
// const NewComment = (props) => {
//   const addComment = (value) => {
//     const body = { parent: props.storyId, content: value };
//     post("/api/comment", body).then((comment) => {
//       // display this comment on the screen
//       props.addNewComment(comment);
//     });
//   };

//   return <NewPostInput defaultText="New Comment" onSubmit={addComment} />;
// };

/**
 * New Story is a New Post component for comments
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 */
// const NewStory = (props) => {
//   const addStory = (value) => {
//     const body = { content: value };
//     post("/api/story", body).then((story) => {
//       // display this story on the screen
//       props.addNewStory(story);
//     });
//   };

//   return <NewPostInput defaultText="New Story" onSubmit={addStory} />;
// };

/**
 * New Message is a New Message component for messages
 *
 * Proptypes
 * @param {UserObject} recipient is the intended recipient
 * addNewRoom is a prop
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