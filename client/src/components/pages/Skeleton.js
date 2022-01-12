import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import CreateRoom from "../modules/CreateRoom.js";
import { NewRoom } from "../modules/NewPageInput";


import "../../utilities.css";
import "./Skeleton.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID --> DONE
// const GOOGLE_CLIENT_ID = "476771463106-5p85qlaqfetmh67l5bmn4394k0nl9aoi.apps.googleusercontent.com";

/* propTypes
* @param [String] roomLinks
* @param addNewRoom
*/

const Skeleton = (props) => {
  return (
    <>
      <h1>Helloooo :O</h1>
      <div>
        <CreateRoom/>
      </div>
      <div>
        <NewRoom addNewRoom = {props.addNewRoom} />
      </div>
      <div>
        Number of rooms open: {props.roomLinks.length}
        {props.roomLinks}
      </div>
      <h2> What you need to change in this skeleton</h2>
      <ul>
        <li>
          Change the Frontend CLIENT_ID (Skeleton.js) to your team's CLIENT_ID (obtain this at
          http://weblab.to/clientid)
        </li>
        <li>Change the Server CLIENT_ID to the same CLIENT_ID (auth.js)</li>
        <li>
          Change the Database SRV (mongoConnectionURL) for Atlas (server.js). You got this in the
          MongoDB setup.
        </li>
        <li>Change the Database Name for MongoDB to whatever you put in the SRV (server.js)</li>
      </ul>
      <h2>How to go from this skeleton to our actual app</h2>
      <a href="http://weblab.to/get-started">Check out this getting started guide</a>
    </>
  );
};

export default Skeleton;
