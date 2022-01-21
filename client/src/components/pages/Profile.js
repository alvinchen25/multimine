import React, { useState, useEffect } from "react";
import { get } from "../../utilities"
import NavBar from "../modules/NavBar.js"

import "../../utilities.css";
import "./Profile.css";

const Profile = (props) => {
  const [user, setUser] = useState();
  const [userScores, setUserScores] = useState();
  const [avgScore, setAvgScore] = useState(0);

  // const userScores = undefined

  useEffect(() => {
    document.title = "Profile Page";
    let avgCounter = 0;
    get(`/api/user`, { userid: props.userId }).then((userObj) => {
      setUser(userObj);
      userObj.times.map((round) => {
        avgCounter=avgCounter+round.score/1000;
        console.log(`round score: ${round.score} and avgscore ${avgScore}`);
      });
      setAvgScore(avgCounter/userObj.times.length);
      userObj.times.sort((a,b) => {
        return a.score-b.score;
      });
      const newUserScores = (userObj.times.length>0) ? (userObj.times.map((round) => (
        <>
         <div>
           {(round.score)/1000} seconds
         </div>
         <div>
          Date: {round.gameTime.substring(0,10)} {round.gameTime.substring(11, 19)} UTC
          </div>
          <div>
            Board Size: {round.boardSize}
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
        <h2> Number of games: {user.times.length}</h2>
        <h2> Average time: {avgScore} seconds</h2>
        <h2> Best time: {user.topscore.score/1000} seconds</h2>
        <h2>Your Scores</h2>
        <h3>{userScores}</h3>
      </div>
    </>
  );
};

export default Profile;
