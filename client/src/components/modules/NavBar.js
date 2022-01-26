import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import { get, post } from "../../utilities";
import "./NavBar.css";

// This identifies your application to Google's authentication service
const GOOGLE_CLIENT_ID = "476771463106-5p85qlaqfetmh67l5bmn4394k0nl9aoi.apps.googleusercontent.com";

const NavBar = (props) => {
    return (
      <nav className="NavBar-container">
        <div className="NavBar-linkContainer">
        
          {/* <Link to="/chat/" className="NavBar-link">
            Chat
          </Link> */}
          <Link to="/howtoplay/" className="NavBar-link linkAnimation">
            How to Play
          </Link>
          <Link to="/leaderboard/" className="NavBar-link linkAnimation">
            Leaderboard
          </Link>
          <div className="spacer"></div>

        </div>

        <span className="NavBar-title titleAnime">
        <Link to="/" className="NavBar-link">
            MULTIMINE
          </Link>
          </span>

        <div className="userStuff">
           {/* {props.userId && (
            <Link to={`/profile/${props.userId}`} className="NavBar-link">
              Profile
            </Link>
          )} */}
          {(props.logStable) ? (props.userId ? (
            <>
            <Link to={`/profile/${props.userId}`} className="NavBar-link linkAnimation">
              Profile
            </Link>
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={props.handleLogout}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
            <div className="spacer"></div>
            </>
          ) : (
            <>
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={props.handleLogin}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
            <div className="spacer"></div>
            </>
          )) : (
            <><div className="spacer"></div></>
          )}

          </div>
      </nav>
    );
  };
  
  export default NavBar;