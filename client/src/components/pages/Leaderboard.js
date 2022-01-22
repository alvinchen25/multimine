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
          <div>
            RUN: <Link to={"/profile/"+userObj._id}>{userObj.name}</Link>
            
            TIME {userObj.topscoreSmall.score/1000} seconds with date {userObj.topscoreSmall.gameTime.substring(0,10)} {userObj.topscoreSmall.gameTime.substring(11,19)} UTC
          </div>
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
          <div>
            RUN: <Link to={"/profile/"+userObj._id}>{userObj.name}</Link>
            
            TIME {userObj.topscoreMedium.score/1000} seconds with date {userObj.topscoreMedium.gameTime.substring(0,10)} {userObj.topscoreMedium.gameTime.substring(11,19)} UTC
            </div>
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
          <div>
            RUN: <Link to={"/profile/"+userObj._id}>{userObj.name}</Link>
            
            TIME {userObj.topscoreLarge.score/1000} seconds with date {userObj.topscoreLarge.gameTime.substring(0,10)} {userObj.topscoreLarge.gameTime.substring(11,19)} UTC
            </div>
        </> ) : (<></>)
      ));
      setAllLargeRuns(bestLargeRunScores);
    });
  }, []);

  return (
    <>
      <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        logStable={true}
        />
      <div>
        This will be the leaderboard. But right now, it's just a list of everybody's runs, not in order.
      </div>
      <div>
        SMALL: {allSmallRuns}
      </div>
      <div>MEDIUM: {allMediumRuns}</div>
      <div>LARGE: {allLargeRuns}</div>

    </>
  );
};

export default Leaderboard;
