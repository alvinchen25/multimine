import React, { useState, useEffect } from "react";
import { get } from "../../utilities"
import NavBar from "../modules/NavBar.js"

import "../../utilities.css";
import "./Profile.css";

const Profile = (props) => {
  const [user, setUser] = useState();
  const [userScores, setUserScores] = useState();

  // const userScores = undefined

  useEffect(() => {
    document.title = "Profile Page";
    get(`/api/user`, { userid: props.userId }).then((userObj) => {
      setUser(userObj);
      const newUserScores = (userObj.times.length>0) ? (userObj.times.map((round) => (
        <>
         <div>
           {(round.score)/1000} seconds
         </div>
         <div>
          {round.gameTime}
          </div>
       </>
      ))) : (
        <>
          <div>Complete a game to see your scores!</div>
        </>
      );
      // if (userObj.times.length === 0) {
      //   newUserScores = (
      //     <>
      //       <div>Complete a game to see your scores!</div>
      //     </>
      //   );
      // }
      setUserScores(newUserScores);
      // setUserScores(userObj.times)

    });
  }, []);

  // console.log(`times listed here ${user.times}`);

  if (!user) {
    return (
    <>
      <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        logStable={false}
        />
      <div> <h3 className="loadingPage"> Loading . . . </h3> </div>
    </>
    );
  }
  return (
    <>
      <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        logStable={false}
        />
      <div>
        <h1 className="Profile-name u-textCenter">{user.name}</h1>
        <h2>Your Scores</h2>
        <h3>{userScores}</h3>
      </div>
    </>
  );
};

export default Profile;
