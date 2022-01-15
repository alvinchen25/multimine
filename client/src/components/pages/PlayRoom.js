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
  const [progress, setProgress] = useState(0);

  // const incrementProgress = () => {
  //   setProgress()
  // }
  // async function updateProgress() {
  //   await setProgress(progress+1);
  // }

  useEffect(() => {
    const callback = (userList) => {
      console.log("helloooo");
      console.log(userList);
      setUserList(userList);
    }
    // const addUserToRoomList = ;
     socket.on("roomupdate", callback);
     return () => {
       socket.off("roomupdate", callback);
     };
   }, []);

  useEffect(() => {
   // console.log(props._id);
    const body = {roomId: props._id};
    //post("/api/joinroom", body);
    socket.emit("joinroomSock", props._id);
    return () => {
      socket.emit("leaveroomSock", props._id);
    }
  }, []);

  

  const [progressValues, setprogressValues] = useState(null);
  // const dummyProgress = [{username: "vishaal", progress: 98}];
  useEffect(() => {
    // const dummyProgress = [{username: "vishaal", progress: 28}, {username: "boomer", progress: 98}];
  
    const dummyProgress = [2,3,4];
    // setprogressValues([...dummyProgress]);
    setprogressValues(dummyProgress);
  }, []);

  
  
  const [activeChat, setActiveChat] = useState({
    recipient: ALL_CHAT,
    messages: [],
  });

  const loadMessageHistory = (recipient) => {
    get("/api/chat", { recipient_id: recipient._id }).then((messages) => {
      setActiveChat({
        recipient: recipient,
        messages: messages,
      });
    });
  };

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
    loadMessageHistory(ALL_CHAT);
  }, []);

  useEffect(() => {
    socket.on("message", addMessages);
    return () => {
      socket.off("message", addMessages);
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

  
  
  const navigate = useNavigate()

  const handleLeave = (event) => {
    event.preventDefault();
    const body = {roomId: props._id};
   // post("/api/leaveroom", body);
    navigate("/");
  }

const ongoing = (false); // remove later

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
                <Board height={16} width={30} mines={99} setProgress={setProgress} progress={progress}/>
              </div>
            ) : (
              <>
              <div className="game-board displayBlock">
               <h1>Settings</h1>
               <h3>
                 Add settings here!








               </h3>
               <h1><button type="button" className="leaveRoomButton">Start Game</button></h1>
               </div>
               </>
              )
            }
          {/* set ongoing as a prop later on*/}

        
        
        <div className="progressBars"> {/* for more styling eventually*/}
          <ProgressBars progressValues={progressValues} userList={userList}/>
          {/* Will pass in info from sockets to get progress from other players */}
          {/* should actually be to the right of the board */}
          
          This is our current progress: {progress}
        
        </div>
        {/* <div>
          This is the user list:
          {userList}
        </div> */}

        </div>
        <div>
          <Chat data={activeChat}/>
        </div>
      </div>
    </>
  );
};

export default PlayRoom;
