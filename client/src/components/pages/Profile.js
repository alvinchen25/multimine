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
      console.log(`user times: ${JSON.stringify(userObj.times)} and score ${JSON.stringify(userObj.times[0].score)}`);
      const newUserScores = userObj.times.map((round) => (
        <>
         <div>
           {round.score}
         </div>
         <div>
          {round.gameTime}
          </div>
       </>
      ));
      setUserScores(newUserScores);
      // setUserScores(userObj.times)

    });
  }, []);

  // console.log(`times listed here ${user.times}`);

  // const userScores = user.times.map((round) => (
  //   <>
  //     <div>
  //       {round.score}
  //     </div>
  //   </>
  // ));

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
        <h2>User times: {user.times[3].score}</h2>
        <h2>Alt times: {JSON.stringify(user.times)}</h2>
        <h2>{userScores}</h2>
      </div>
    </>
  );
};

export default Profile;
