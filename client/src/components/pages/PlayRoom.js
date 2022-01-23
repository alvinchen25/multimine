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
  const [frozenList, setFrozenList] = useState({});
  const [progress, setProgress] = useState(0);
  const [ongoing, setOngoing] = useState(false);
  const [gameState, setGameState] = useState("before");
  const [mineList, setMineList] = useState([]);
  const [roomCode, setRoomCode] = useState("");
  const [endStats, setEndStats] = useState([]);
  const [frozen, setFrozen] = useState(0);
  const [height, setHeight] = useState(16);
  const [width, setWidth] = useState(30);
  const [mines, setMines] = useState(99);
  const [freezeTime, setFreezeTime] = useState(10);
  const stylename = "game-board-"+props.boardSize;

  useEffect(() => {
    if (props.boardSize === "small") {
      setHeight(9);
      setWidth(9);
      setMines(10);
      setFreezeTime(2000);
    }
    else if (props.boardSize === "medium") {
      setHeight(16);
      setWidth(16);
      setMines(40);
      setFreezeTime(5000);
    }
    else if (props.boardSize === "large") {
      setHeight(16);
      setWidth(30);
      setMines(99);
      setFreezeTime(10000);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0,0);
    return () => {
      navigate("/");
    };
  }, []);


  const updateFrozen = () => {
    setFrozen(frozen => {
      if(frozen > 0){
        return frozen - 100;
      }else{
        return 0;
      }
    });
  };

  const addFrozen = () => {
    // console.log(frozen);
    setFrozen(frozen+freezeTime);
  };

  useEffect(() => {
    setInterval(updateFrozen, 100);
  }, []);


  // useEffect(() => {
  //   get("/api/roomstatus", {room: props._id}).then((thing) => {
  //     if(thing.status !== "before"){
  //       navigate("/");
  //     }
  //   });
  // }, []);

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
      const body = {room: props._id};
      post("/api/deleteroom", body);
    }
  },[]);

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
    // console.log(newEndStats);
    setEndStats(newEndStats);
  };
  
  useEffect(() => {
    socket.on("hidegame", hideGamecallback);
    return () => {
      socket.off("hidegame", hideGamecallback);
    }
  }, [endStats]);


  useEffect(() => {
    socket.emit("progressUpdate",{progress: progress, room: props._id, frozen: frozen});
    // console.log(`progress update! progress: ${progress} and frozen: ${frozen}`);
    if (progress >= (height*width-mines)) {
      setGameState("after");
      socket.emit("endGame", {room: props._id, socketid: socket.id});
      const body = {userId: props.userId, room: props._id, boardSize: props.boardSize};
      post("/api/addHighScore", body);
    }
  },[progress, frozen]);

  const ProgressCallback = ({user, progress, userFrozen}) => {
    let newProgressList = {...progressList};
    newProgressList[user.name] = progress;
    setProgressList(newProgressList);
    let newFrozenList = {...frozenList};
    newFrozenList[user.name] = userFrozen;
    setFrozenList(newFrozenList);
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
      (pro === height*width-mines) ? (
      <>
        <h3>{user}</h3>
        <div className="progressHolderDone">
          <div style={{width: `${pro*100/(height*width-mines)}%`}}></div>
        </div>
      </>
      ) : ( (frozenList[user]) ? (
      <>
        <h3>{user}</h3>
        <div className="progressHolderFrozen">
          <div style={{width: `${pro*100/(height*width-mines)}%`}}></div>
        </div>
      </>
      ) : (
      <>
        <h3>{user}</h3>
        <div className="progressHolder">
          <div style={{width: `${pro*100/(height*width-mines)}%`}}></div>
        </div>
      </>
      )
      )
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
    socket.emit('startGame', {room: props._id, height: height, width: width, mines: mines});
  }

  return (
    <>
      <div>
      {/* <div className="u-flex u-flex-justifyCenter"> */}
      {/* <div className="roomHeader"> */}
        {/* <h1></h1> */}
        {/* <div className="roomTitle"> */}
        <h1 className="u-textCenter">Room {props.name}</h1>
        {/* </div> */}
        <button type="button" className="button leaveRoomButton" onClick={handleLeave}>
        Leave Room
        </button>  
      {/* </div> */}
      
        <div className ="gameRoom">

           { (gameState === "before") ? (<>
              {/* <div className={`game-board ${props.boardSize} displayBlock`}> */}
              <div className={`game-board-${props.boardSize} displayBlock`}>
               {/* <h1>Settings</h1> */}
               { (props.isPrivate === true) ? (
                 <h3>
                 Room Code: {roomCode}
               </h3>
               ) : (
                <>
                </>
                )
               }
               <h3>
                 Dimensions: {width} x {height}
               </h3>
               <h3>
                 Number of Mines: {mines}
               </h3>
               <h3>
                 Mine Penalty: {freezeTime/1000} seconds
               </h3>
               <h1><button type="button" className="button" onClick = {handleStart}><h3>Start Game</h3></button></h1>
               </div>
               </>
              ) : (
                <>
             <div className={`game-board-${props.boardSize} ${props.boardSize}`}>
                {(frozen > 0) ? (<div className={`coverUp u-flex ${props.boardSize} u-flex-alignCenter`}><h1>{Math.ceil(frozen/1000)}</h1></div>) : (<> </>)}
                <Board
                  height={height}
                  width={width}
                  mines={mines}
                  // height={16}
                  // width={32}
                  // mines={99}
                  room = {props._id}
                  setProgress = {setProgress}
                  progress = {progress}
                  mineList = {mineList}
                  setGameState = {setGameState}
                  userId = {props.userId}
                  frozen = {frozen}
                  addFrozen = {addFrozen}/>

                 
              </div>
              </>
              )
              }
        {/* <div>
          {(gameState == "during") && <Stopwatch />}
        </div> */}
        <div className="progressBars"> {/* for more styling eventually*/}
          {(gameState == "during") && <Stopwatch />}
          Squares cleared: {progress}
          {YeetProgressList}

        </div>

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
