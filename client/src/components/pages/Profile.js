import React, { useState, useEffect } from "react";
import { get } from "../../utilities"
import NavBar from "../modules/NavBar.js"

import "../../utilities.css";
import "./Profile.css";

const Profile = (props) => {
  const [user, setUser] = useState();
  const [userSmallScores, setUserSmallScores] = useState();
  const [avgSmallScore, setAvgSmallScore] = useState(0);
  const [userMediumScores, setUserMediumScores] = useState();
  const [avgMediumScore, setAvgMediumScore] = useState(0);
  const [userLargeScores, setUserLargeScores] = useState();
  const [avgLargeScore, setAvgLargeScore] = useState(0);

  // const userScores = undefined

  useEffect(() => {
    document.title = "Profile Page";
    let avgSmallCounter = 0;
    get(`/api/user`, { userid: props.userId }).then((userObj) => {
      setUser(userObj);
      userObj.smallTimes.map((round) => {
        avgSmallCounter=avgSmallCounter+round.score/1000;
        // console.log(`round score: ${round.score} and avgscore ${avgSmallScore}`);
      });
      if (userObj.smallTimes.length>0) { // Checks to make sure length of the array is nonzero
        setAvgSmallScore(avgSmallCounter/userObj.smallTimes.length);
      }
      userObj.smallTimes.sort((a,b) => {
        return a.score-b.score;
      });
      const newUserSmallScores = (userObj.smallTimes.length>0) ? (userObj.smallTimes.map((round) => (
        <>
        <tr>
         <td>
           {(round.score)/1000} seconds
         </td>
         <td>
          {round.gameTime.substring(0,10)} {round.gameTime.substring(11, 19)} UTC
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
      setUserSmallScores(newUserSmallScores);

    });
  }, []);

  useEffect(() => {
    let avgMediumCounter = 0;
    get(`/api/user`, { userid: props.userId }).then((userObj) => {
      setUser(userObj);
      userObj.mediumTimes.map((round) => {
        avgMediumCounter=avgMediumCounter+round.score/1000;
        // console.log(`round score: ${round.score} and avgscore ${avgMediumScore}`);
      });
      if (userObj.mediumTimes.length>0) {
        setAvgMediumScore(avgMediumCounter/userObj.mediumTimes.length);
      }
      userObj.mediumTimes.sort((a,b) => {
        return a.score-b.score;
      });
      const newUserMediumScores = (userObj.mediumTimes.length>0) ? (userObj.mediumTimes.map((round) => (
        <>
        <tr>
         <td>
           {(round.score)/1000} seconds
         </td>
         <td>
          {round.gameTime.substring(0,10)} {round.gameTime.substring(11, 19)} UTC
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
      setUserMediumScores(newUserMediumScores);

    });
  }, []);

  useEffect(() => {
    let avgLargeCounter = 0;
    get(`/api/user`, { userid: props.userId }).then((userObj) => {
      setUser(userObj);
      userObj.largeTimes.map((round) => {
        avgLargeCounter=avgLargeCounter+round.score/1000;
        // console.log(`round score: ${round.score} and avgscore ${avgLargeScore}`);
      });
      if (userObj.largeTimes.length>0) {
        setAvgLargeScore(avgLargeCounter/userObj.largeTimes.length);
      }
      userObj.largeTimes.sort((a,b) => {
        return a.score-b.score;
      });
      const newUserLargeScores = (userObj.largeTimes.length>0) ? (userObj.largeTimes.map((round) => (
        <>
        <tr>
         <td>
           {(round.score)/1000} seconds
         </td>
         <td>
          {round.gameTime.substring(0,10)} {round.gameTime.substring(11, 19)} UTC
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
      setUserLargeScores(newUserLargeScores);
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
        <h2 className="u-textCenter">Account created: {user.dateCreated.substring(5,7)}/{user.dateCreated.substring(8,10)}/{user.dateCreated.substring(0,4)}</h2>
        <h2 className="u-textCenter">Total number of games: {user.smallTimes.length+user.mediumTimes.length+user.largeTimes.length}</h2>
        </div>





        
      </div>
      <div className="u-flex boardSummary">
      <div className="statContainer">
        <div className="stats">
          <h1>Small</h1>
          <h3>9x9, 10 mines</h3>
          <h2> Number of games: {user.smallTimes.length}</h2>
          <h2> Average time: {avgSmallScore} seconds</h2>
          <h2> Best time: {user.topscoreSmall.score/1000} seconds</h2>
          <table>
            <tr>
            <th>Time:</th>
            <th>Date:</th>
            </tr>
            {userSmallScores}
            
          </table>
        </div>
      </div>
      <div className="statContainer">
        <div className="stats">
          <h1> Medium</h1>
          <h3>16x16, 40 mines</h3>
          <h2> Number of games: {user.mediumTimes.length}</h2>
          <h2> Average time: {avgMediumScore} seconds</h2>
          <h2> Best time: {user.topscoreMedium.score/1000} seconds</h2>
          <table>
            <tr>
            <th>Time:</th>
            <th>Date:</th>
            </tr>
            {userMediumScores}
            
          </table>
        </div>
      </div>
      <div className="statContainer">
        <div className="stats">
          <h1> Large</h1>
          <h3> 30x16, 99 mines</h3>
          <h2> Number of games: {user.largeTimes.length}</h2>
          <h2> Average time: {avgLargeScore} seconds</h2>
          <h2> Best time: {user.topscoreLarge.score/1000} seconds</h2>
          <table>
            <tr>
            <th>Time:</th>
            <th>Date:</th>
            </tr>
            {userLargeScores}
          </table>
        </div>
      </div>
      </div>
    </>
  );
};

export default Profile;
