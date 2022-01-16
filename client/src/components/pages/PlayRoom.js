import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import Board from "../modules/Board.js";
import { socket } from "../../client-socket.js";
import { post } from "../../utilities";
import ProgressBars from "../modules/ProgressBars.js"
import { Link } from "@reach/router";
import Chat from "../modules/Chat.js";
import NavBar from "../modules/NavBar.js"
import { useNavigate } from "@reach/router"

import "../../utilities.css";
import "./PlayRoom.css";
import "./Game.css"
import "../modules/ProgressBars.css";
import "./Chatbook.css";

/* PropTypes
* String _id, gives the id of the room
* PlayRoom should take in a HOST
*/

const ALL_CHAT = {
  _id: "ALL_CHAT",
  name: "ALL CHAT",
};

const PlayRoom = (props) => {
  const [userList, setUserList] = useState([]);
  const [progressList, setProgressList] = useState({});
  const [progress, setProgress] = useState(0);
  const [ongoing, setOngoing] = useState(false); 
  const [mineList, setMineList] = useState([]);
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  useEffect(() => {
    get("/api/roomcode", {room: props._id}).then((thing) => {
      setRoomCode(thing.code);
    });
  }, []);

  const Userlistcallback = (userList) => {
    console.log(userList);
    setUserList(userList);
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
  }, []);

  useEffect(() => {
    const callback = (newMineList) => {
      setMineList(newMineList);
    };
    socket.on("initmines", callback);
    return () => {
      socket.off("initmines", callback);
    }
  }, []);

  useEffect(() => {
    const callback = () => {
      setOngoing(true);
    };
    socket.on("showgame", callback);
    return () => {
      socket.off("showgame", callback);
    }
  }, []);

  const ProgressCallback = ({user, progress}) => {
    let newProgressList = {...progressList};
    console.log(`ProgressList: ${JSON.stringify(newProgressList)}`);
    console.log(`initial list: ${JSON.stringify(progressList)}`);
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
  
  
  const [activeChat, setActiveChat] = useState({
    recipient: {
      _id: props._id,
      name: `Room: ${props._id}`,
    },
    messages: [],
  });

  // const loadMessageHistory = (recipient) => {
  //   get("/api/chat", { recipient_id: recipient._id }).then((messages) => {
  //     setActiveChat({
  //       recipient: recipient,
  //       messages: messages,
  //     });
  //   });
  // };

  const addMessages = (data) => {
    setActiveChat(prevActiveChat => ({
      recipient: prevActiveChat.recipient,
      messages: prevActiveChat.messages.concat(data),
    }));
    console.log(`data in addMessages: ${data}`);
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
    <h3>Please log in before using Multimine</h3>

    </>
    );
  }

  
  
  const navigate = useNavigate();

  const handleLeave = (event) => {
    event.preventDefault();
    const body = {roomId: props._id};
   // post("/api/leaveroom", body);
    navigate("/");
  }

  const handleStart = (event) => {
    event.preventDefault();
    socket.emit('startGame', props._id);
  }

  return (
    <>
      <div>
      <div className="u-flex u-flex-justifyCenter"> {/* for more styling eventually*/}
        <h1 className="Profile-name u-textCenter">Room ID: {props._id}</h1>
        <Link to="/">
        <button type="button" className="leaveRoomButton" onClick={handleLeave}>
          Leave Room
        </button>
        </Link>
        
        </div>
      
        <div className ="u-flex">

        
           { (ongoing) ? (
             <div className="game-board">
                <Board height={16} width={30} mines={99} room = {props._id} setProgress={setProgress} progress={progress} mineList = {mineList}/>
              </div>
            ) : (
              <>
              <div className="game-board displayBlock">
               <h1>Settings</h1>
               <h3>
                Room Code: {roomCode}
               </h3>
               <h1><button type="button" className="leaveRoomButton" onClick = {handleStart}>Start Game</button></h1>
               </div>
               </>
              )
            }
          {/* set ongoing as a prop later on*/}

        
        
        <div className="progressBars"> {/* for more styling eventually*/}
          This is our current progress: {progress}
            {YeetProgressList}
        </div>
        {/* <div>
          This is the user list:
          {userList}
        </div> */}

        </div>
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
