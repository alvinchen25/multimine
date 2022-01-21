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
        <tr>
         <td>
           {(round.score)/1000} seconds
         </td>
         <td>
          {round.gameTime.substring(0,10)} {round.gameTime.substring(11, 19)} UTC
          </td>
        <td>
         {round.boardSize}
        </td>
          </tr>
       </>
      ))) : (
        <>
          <tr>
            <td></td>
            <td>Complete a game to see your scores!</td>
          </tr>
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
      <div className="u-flex profileContainer">
        <div className="name">
        <h1 className="Profile-name u-textCenter">{user.name}</h1>
        <h2 className="u-textCenter">Account Age: {user.name}</h2>
        </div>
        <div className="stats">
        <h2> Number of games: {user.times.length}</h2>
        <h2> Average time: {avgScore} seconds</h2>
        {/* <h2> 5 most recent times: </h2> */}
        <h2> Best time: {user.topscore.score/1000} seconds</h2>
        


        <h2 className="u-textCenter">Your Scores</h2>
        <table>
          <th>Time:</th>
          <th>Date:</th>
          <th>Board Size:</th>
          {userScores}
        </table>

        
        </div>
      </div>
    </>
  );
};

export default Profile;
