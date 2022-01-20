import React, { useState, useEffect } from "react";
import { get } from "../../utilities"
import NavBar from "../modules/NavBar.js"

import "../../utilities.css";
import "./Leaderboard.css";
import { Link } from "@reach/router";


const Leaderboard = (props) => {
  const [allRuns, setAllRuns] = useState([]);

  useEffect(() => {
    document.title = "Leaderboard";
    
    get(`/api/allUsers`, {}).then((userObjs) => {
      userObjs.sort((a,b) => {
        return a.topscore.score-b.topscore.score;
      });
      let bestRunScores = userObjs.map((userObj) => (
        (userObj.topscore.score>0) ? (
        <>
          <div>
            RUN: <Link to={"/profile/"+userObj._id}>{userObj.name}</Link>
            
            TIME {userObj.topscore.score/1000} seconds with date {userObj.topscore.gameTime}
            {/* RUN: {userObj.name}, TIME {userObj.topscore} seconds, DATE: {runObj.gameTime.substring(0,10)} {runObj.gameTime.substring(11, 19)} UTC */}
          </div>
        </> ) : (<></>)
      ));
      setAllRuns(bestRunScores);
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
        {allRuns}
      </div>
    </>
  );
};

export default Leaderboard;
