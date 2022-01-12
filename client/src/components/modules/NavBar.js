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
// class NavBar extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       userId: null,
//     }
//   }

//   componentDidMount() {
//     get("/api/whoami").then((user) => {
//       if (user._id) {
//         // if the user is logged in, save their ID in react state
//         this.setState({ userId: user._id });
//       }
//     });
//   }

// //   handleLogin = (res) => {
// //     // 'res' contains the response from Google's authentication servers
// //     console.log(res);

// //     const userToken = res.tokenObj.id_token;
// //     post("/api/login", { token: userToken }).then((user) => {
// //       // the server knows we're logged in now
// //       this.setState({ userId: user._id });
// //       console.log(user);
// //     });
// //   };

// //   handleLogout = () => {
// //     console.log("Logged out successfully!");
// //     this.setState({ userId: null });
// //     post("/api/logout");
// //   };

//   render() {
//     return (
//       <nav className="NavBar-container">
//         <Link to="/" className="NavBar-title u-inlineBlock">Lobby</Link>
//         <div className="NavBar-linkContainer u-inlineBlock">
//           {/* <Link to="/" className="NavBar-link">
//             Home
//           </Link> */}
//           <Link to="/game/" className="NavBar-link">
//             Gameplay
//           </Link>
//           {/* THIS PROFILE is gonna have :userid later */}
//           <Link to="/profile/" className="NavBar-link">
//               Profile
//           </Link>
//           <Link to="/chat/" className="NavBar-link">
//               Chat
//           </Link>
//           {this.state.userId ? (
//             <GoogleLogout
//               clientId={GOOGLE_CLIENT_ID}
//               buttonText="Logout"
//               onLogoutSuccess={this.handleLogout}
//               onFailure={(err) => console.log(err)}
//               className="NavBar-link NavBar-login"
//             />
//           ) : (
//             <GoogleLogin
//               clientId={GOOGLE_CLIENT_ID}
//               buttonText="Login"
//               onSuccess={this.handleLogin}
//               onFailure={(err) => console.log(err)}
//               className="NavBar-link NavBar-login"
//             />
//           )}
//         </div>
//       </nav>
//     );
//   }
// }

// export default NavBar;


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
          <Link to="/game/" className="NavBar-link">
            Single-Player Game
          </Link>
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