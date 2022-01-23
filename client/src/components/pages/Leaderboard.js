import React, { useState, useEffect } from "react";
import { get } from "../../utilities"
import NavBar from "../modules/NavBar.js"

import "../../utilities.css";
import "./Leaderboard.css";
import { Link } from "@reach/router";


const Leaderboard = (props) => {
  const [allSmallRuns, setAllSmallRuns] = useState([]);
  const [allMediumRuns, setAllMediumRuns] = useState([]);
  const [allLargeRuns, setAllLargeRuns] = useState([]);

  useEffect(() => { // gets the top small scores
    document.title = "Leaderboard";
    
    get(`/api/allUsers`, {}).then((userObjs) => {
      userObjs.sort((a,b) => {
        return a.topscoreSmall.score-b.topscoreSmall.score;
      });
      let bestSmallRunScores = userObjs.map((userObj) => (
        (userObj.topscoreSmall.score>0) ? (
        <>
          <tr>
            <td>
            <Link to={"/profile/"+userObj._id}>{userObj.name}</Link>
            </td>
            <td>
            {userObj.topscoreSmall.score/1000} seconds
            </td>
            <td>
            {userObj.topscoreSmall.gameTime.substring(5,7)}/{userObj.topscoreSmall.gameTime.substring(8,10)}/{userObj.topscoreSmall.gameTime.substring(0,4)}

            
            </td>
            {/* {userObj.topscoreSmall.gameTime.substring(0,10)} {userObj.topscoreSmall.gameTime.substring(11,19)} UTC */}
            {/* Board Size: {userObj.topscoreSmall.boardSize} */}
            {/* RUN: {userObj.name}, TIME {userObj.topscore} seconds, DATE: {runObj.gameTime.substring(0,10)} {runObj.gameTime.substring(11, 19)} UTC */}
          </tr>
        </> ) : (<></>)
      ));
      setAllSmallRuns(bestSmallRunScores);
    });
  }, []);

  useEffect(() => { // top medium scores
    
    get(`/api/allUsers`, {}).then((userObjs) => {
      userObjs.sort((a,b) => {
        return a.topscoreMedium.score-b.topscoreMedium.score;
      });
      let bestMediumRunScores = userObjs.map((userObj) => (
        (userObj.topscoreMedium.score>0) ? (
        <>
          <tr>
            <td>
            <Link to={"/profile/"+userObj._id}>{userObj.name}</Link>
            </td>
            <td> {userObj.topscoreMedium.score/1000} seconds 
            </td>
            <td>{userObj.topscoreMedium.gameTime.substring(5,7)}/{userObj.topscoreMedium.gameTime.substring(8,10)}/{userObj.topscoreMedium.gameTime.substring(0,4)}
            </td>
            {/* {userObj.topscoreMedium.gameTime.substring(0,10)} {userObj.topscoreMedium.gameTime.substring(11,19)} UTC */}
            {/* Board Size: {userObj.topscoreMedium.boardSize} */}
            {/* RUN: {userObj.name}, TIME {userObj.topscore} seconds, DATE: {runObj.gameTime.substring(0,10)} {runObj.gameTime.substring(11, 19)} UTC */}
          </tr>
        </> ) : (<></>)
      ));
      setAllMediumRuns(bestMediumRunScores);
    });
  }, []);

  useEffect(() => { //top large scores
    document.title = "Leaderboard";
    
    get(`/api/allUsers`, {}).then((userObjs) => {
      userObjs.sort((a,b) => {
        return a.topscoreLarge.score-b.topscoreLarge.score;
      });
      let bestLargeRunScores = userObjs.map((userObj) => (
        (userObj.topscoreLarge.score>0) ? (
        <>
          <tr>
            <td>
            <Link to={"/profile/"+userObj._id}>{userObj.name}</Link>
            </td>
            <td> {userObj.topscoreLarge.score/1000} seconds 
            </td>
            <td> {userObj.topscoreLarge.gameTime.substring(5,7)}/{userObj.topscoreLarge.gameTime.substring(8,10)}/{userObj.topscoreLarge.gameTime.substring(0,4)}
            </td>
            {/* {userObj.topscoreLarge.gameTime.substring(0,10)} {userObj.topscoreLarge.gameTime.substring(11,19)} UTC */}
            {/* Board Size: {userObj.topscoreLarge.boardSize} */}
            {/* RUN: {userObj.name}, TIME {userObj.topscore} seconds, DATE: {runObj.gameTime.substring(0,10)} {runObj.gameTime.substring(11, 19)} UTC */}
          </tr>
        </> ) : (<></>)
      ));
      setAllLargeRuns(bestLargeRunScores);
    });
  }, []);


  // const openScores = (size) => {
  //   if (document.getElementById(size) === null) {

  //       }
  //   else {
  //   var i;
  //   var x = document.getElementsByClassName("scores");
  //   for (i = 0; i < x.length; i++) {
  //     x[i].style.display = "none";
  //   }
  //   document.getElementById(size).style.display = "block";
  // }
  // }


  return (
    <>
      <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        logStable={true}
        />
      
      {/* <div class="tabBar">
        <button class="tabItem" onclick={openScores('small')}>Small</button>
        <button class="tabItem" onclick={openScores('medium')}>Medium</button>
        <button class="tabItem"  onclick={openScores('large')}>Large</button>
      </div> */}

      {/* <div id="small" className="scores" style={{display:"block;"}}>
        SMALL: {allSmallRuns}
      </div>
      <div id="medium" className="scores" style={{display:"none"}}>
        MEDIUM: {allMediumRuns}
        </div>
      <div id="large" className="scores" style={{display:"none"}}>
        LARGE: {allLargeRuns}
        </div> */}
        <h1 className="u-textCenter">Global Leaderboard</h1>

        <div className="u-flex scoreHolder">
        <div id="small" className="scores">
          <h1 className="u-textCenter">SMALL</h1>
          <h3>9x9, 10 mines</h3>
          <table>
              <tr>
              <td>RUN</td>
              <td>TIME</td>
              <td>DATE</td>
              </tr>
           {allSmallRuns}
           </table>
        </div>
        <div id="medium" className="scores">
        <h1 className="u-textCenter">MEDIUM</h1>
        <h3>16x16, 40 mines</h3> 
        <table>
              <tr>
              <td>RUN</td>
              <td>TIME</td>
              <td>DATE</td>
              </tr>
        {allMediumRuns}
        </table>
         </div>
        <div id="large" className="scores">
        <h1 className="u-textCenter">LARGE</h1> 
        <h3> 30x16, 99 mines</h3>
        <table>
              <tr>
              <td>RUN</td>
              <td>TIME</td>
              <td>DATE</td>
              </tr>
            {allLargeRuns}
        </table>
        </div>

        </div>

    </>
  );
};

export default Leaderboard;
