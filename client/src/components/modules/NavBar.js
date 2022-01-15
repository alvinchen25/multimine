import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import { get, post } from "../../utilities";
import "./NavBar.css";

// This identifies your application to Google's authentication service
const GOOGLE_CLIENT_ID = "476771463106-5p85qlaqfetmh67l5bmn4394k0nl9aoi.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */

const NavBar = (props) => {
    return (
      <nav className="NavBar-container">
        <div className="NavBar-title u-inlineBlock">
        <Link to="/" className="NavBar-link">
            Multimine
          </Link>
          </div>
        <div className="NavBar-linkContainer u-inlineBlock">
        
            {/* 
            <Link to="/" className="NavBar-link">
            
            Lobby
          </Link>
            
            might want to keep multimine as the lobby link */}

          {props.userId && (
            <Link to={`/profile/${props.userId}`} className="NavBar-link">
              Profile
            </Link>
          )}
          <Link to="/chat/" className="NavBar-link">
            Chat
          </Link>
          <Link to="/leaderboard/" className="NavBar-link">
            Leaderboard
          </Link>
          {/* <Link to="/game/" className="NavBar-link">
            Single-Player Game
          </Link> */}
          {props.userId ? (
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={props.handleLogout}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
          ) : (
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={props.handleLogin}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
          )}
        </div>
      </nav>
    );
  };
  
  export default NavBar;