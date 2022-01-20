import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import Board from "../modules/Board.js";
import { socket } from "../../client-socket.js";
import { post } from "../../utilities";
import ProgressBars from "../modules/ProgressBars.js";
import Stopwatch from "../modules/Stopwatch.js";
import { Link } from "@reach/router";
import Chat from "../modules/Chat.js";
import NavBar from "../modules/NavBar.js"
import { useNavigate } from "@reach/router"

import "../../utilities.css";
import "./PlayRoom.css";
import "./Game.css"
import "../modules/ProgressBars.css";
import "./Chatbook.css";

/** PropTypes
* @param {String} _id, gives the id of the room
* @param name, gives the room name
* @param userId
* @param userName
* @param handleLogin
* @param handleLogout
* PlayRoom should take in a HOST
*/

const PlayRoom = (props) => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [progressList, setProgressList] = useState({});
  const [progress, setProgress] = useState(0);
  const [ongoing, setOngoing] = useState(false);
  const [gameState, setGameState] = useState("before");
  const [mineList, setMineList] = useState([]);
  const [roomCode, setRoomCode] = useState("");
  const [endStats, setEndStats] = useState([]);

  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  useEffect(() => {
    get("/api/roomstatus", {room: props._id}).then((thing) => {
      if(thing.status !== "before"){
        navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    get("/api/roomcode", {room: props._id}).then((thing) => {
      setRoomCode(thing.code);
    });
  }, []);

  const Userlistcallback = (userList) => {
    if(gameState === "before"){
      setUserList(userList);
    }
    
  }

  useEffect(() => {
     socket.on("roomupdate", Userlistcallback);
     return () => {
       socket.off("roomupdate", Userlistcallback);
     };
   }, [userList]);

  useEffect(() => {
    socket.emit("joinroomSock", props._id);
    return () => {
      socket.emit("leaveroomSock", props._id);
      
    }
  },[]);

  useEffect(() => {
    return () => {
      const body = {room: props._id, code: roomCode};
      post("/api/deleteroom", body);
    }
  },[roomCode]);

  useEffect(() => {
    const callback = (newMineList) => {
      setMineList(newMineList);
    };
    socket.on("initmines", callback);
    return () => {
      socket.off("initmines", callback);
    }
  }, []);

  const showGamecallback = () => {
    setGameState("during");
  };
  
  useEffect(() => {
    socket.on("showgame", showGamecallback);
    return () => {
      socket.off("showgame", showGamecallback);
    }
  }, []);

  const hideGamecallback = ({winner, winTime}) => {
    let newEndStats = [...endStats];
    newEndStats.push({winner: winner, winTime: winTime});
    console.log(newEndStats);
    setEndStats(newEndStats);
  //  setEndStats([{winner: {name: "nitu"}, winTime: 2}]);
   // console.log(`endstats is ${endStats}`);
   // console.log(endStats);
  };
  
  useEffect(() => {
    socket.on("hidegame", hideGamecallback);
    return () => {
      socket.off("hidegame", hideGamecallback);
    }
  }, [endStats]);


  useEffect(() => {
    socket.emit("progressUpdate",{progress: progress, room: props._id});
    if (progress >= 381) {
      setGameState("after");
      socket.emit("endGame", {room: props._id, socketid: socket.id});
      const body = {userId: props.userId, room: props._id};
      post("/api/addHighScore", body);
    }
  },[progress]);

  const ProgressCallback = ({user, progress}) => {
    let newProgressList = {...progressList};
    newProgressList[user.name] = progress;
    setProgressList(newProgressList);
  };

  useEffect(() => {
    socket.on("newProgressUpdate", ProgressCallback);
    return () => {
      socket.off("newProgressUpdate", ProgressCallback);
    }
  }, [progressList]);

  const YeetProgressList = userList.map((user) => {
    let pro = 0;
    if(progressList[user]){
      pro = progressList[user];
    }
    return (
      <>
        <h3>{user}</h3>
        <div className="progressHolder">
          <div style={{width: `${pro*100/381}%`}}></div>
        </div>
      </>
    )
  });

  const YeetLeaderboard = endStats.map((stat, i) => {
      return (
      <>
       <h1>{i+1}. {stat.winner.name}, time: {stat.winTime/1000}</h1>
  
      </>
      )
  });
  
  const [activeChat, setActiveChat] = useState({
    recipient: {
      _id: props._id,
      name: `Room ${props.name}`,
    },
    messages: [],
  });

  const addMessages = (data) => {
    setActiveChat(prevActiveChat => ({
      recipient: prevActiveChat.recipient,
      messages: prevActiveChat.messages.concat(data),
    }));
  };

  useEffect(() => {
    document.title = "Multimine";
  }, []);

  useEffect(() => {
    socket.on("newRoomMessage", addMessages); //just replace message
    return () => {
      socket.off("newRoomMessage", addMessages);
    };
  }, []);

  if (!props.userId) {
    return (
    <>
    <NavBar
      handleLogin={props.handleLogin}
      handleLogout={props.handleLogout}
      userId={props.userId}
    />
    <h3>Please navigate to the lobby and log in before using Multimine</h3>

    </>
    );
  }
  
  

  const handleLeave = (event) => {
    event.preventDefault();
    navigate("/");
  }

  const handleStart = (event) => {
    event.preventDefault();
    socket.emit('startGame', props._id);
  }

  return (
    <>
      <div>
      <div className="u-flex u-flex-justifyCenter">
        <h1 className="Profile-name u-textCenter">Room {props._id}</h1>
        <Link to="/">
        <button type="button" className="leaveRoomButton" onClick={handleLeave}>
          Leave Room
        </button>
        </Link>
        
        </div>
      
        <div className ="gameRoom">

           { (gameState === "before") ? (<>
              <div className="game-board displayBlock">
               <h1>Settings</h1>
               <h3>
                 Room Code: {roomCode}
               </h3>
               <h3>
                 Dimensions: 30 x 16
               </h3>
               <h3>
                 Number of Mines: 99
               </h3>
               <h3>
                 Mine Penalty: 5 seconds
               </h3>
               <h1><button type="button" className="leaveRoomButton" onClick = {handleStart}>Start Game</button></h1>
               </div>
               </>
              ) : (
                <>
             <div className="game-board">
                <Board
                  height={16}
                  width={30}
                  mines={99}
                  room = {props._id}
                  setProgress={setProgress}
                  progress={progress}
                  mineList = {mineList}
                  setGameState = {setGameState}
                  userId={props.userId}/>
              </div>
              </>
              )
              }
        {/* <div>
          {(gameState == "during") && <Stopwatch />}
        </div> */}
        <div className="progressBars"> {/* for more styling eventually*/}
          {(gameState == "during") && <Stopwatch />}
          {/* This is our current progress: {progress} */}
            {YeetProgressList}

        </div>
        {/* <div>
          This is the user list:
          {userList}
        </div> */}

        </div>
        <div> {(gameState==="after") ? (
          <>
           <h1>You're done.</h1>
           {YeetLeaderboard}
           </>
           ) : (<></>) } </div>
        
        <div className="u-flex u-relative Chatbook-container">
        <div className="Chatbook-chatContainer u-relative">
          <Chat data={activeChat} userId={props.userId} userName={props.userName}/>
        </div>
      </div>

      </div>
    </>
  );
};

export default PlayRoom;
