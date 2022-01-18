import React from "react";
import NavBar from "../modules/NavBar.js"

import "../../utilities.css";

const NotFound = (props) => {
  return (
    <>
      <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        logStable={false}
        />
      <div>
        <h1>404 Not Found</h1>
        <p>The page you requested couldn't be found.</p>
      </div>
    </>
  );
};

export default NotFound;
