import React, { useEffect, useState } from "react";

import "./ProgressBars.css";
import { socket } from "../../client-socket.js";

/** Proptypes
* 
*/

const Stopwatch = (props) => {
    const [gameActive, setGameActive] = useState(false);
    const [gamePaused, setGamePaused] = useState(false);
    const [time, setTime] = useState(0);
    useEffect(() => {
        const callback = () => {
          setGameActive(true);
        };
        socket.on("showgame", callback);
        return () => {
          socket.off("showgame", callback);
        }
      }, []);
    useEffect(() => {
        let interval = null;
  
        if (gameActive === true && gamePaused === false) {
            interval = setInterval(() => {
                setTime((time) => time + 10);
            }, 10);
        } else {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [gameActive]);
    
    return (
        <>
            <div>
                Time:
            </div>
            <div> 
                {time/1000}
            </div>
        </>
    );
}

export default Stopwatch;