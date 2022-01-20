import React, { useState, useEffect } from "react";
import { get } from "../../utilities"
import NavBar from "../modules/NavBar.js"

import "../../utilities.css";
import "./Leaderboard.css";

const Leaderboard = (props) => {
  const [allRuns, setAllRuns] = useState([]);

  useEffect(() => {
    document.title = "Leaderboard";
    let newRunScores = [];
    get(`/api/leaderboard`, {}).then((runObjs) => {
      let bestRunScores = runObjs.map((runObj) => (
        <>
          <div>
            RUN: {runObj.username}, TIME {runObj.score} seconds, DATE: {runObj.gameTime}
          </div>
        </>
      ));
      setAllRuns(bestRunScores);
      // newRunScores.concat([runObj]);
    });
    setAllRuns(newRunScores);
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
