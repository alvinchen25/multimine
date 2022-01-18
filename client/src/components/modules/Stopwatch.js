import React, { useEffect, useState } from "react";

import "./ProgressBars.css";
import { socket } from "../../client-socket.js";

/** Proptypes
* 
*/

const Stopwatch = (props) => {
    const [time, setTime] = useState(0);

    const timeCallback = (newTime) => {
      setTime(newTime);
    };
    
    useEffect(() => {
        socket.on("timeUpdate", timeCallback);
        return () => {
          socket.off("timeUpdate", timeCallback);
        }
    }, [time]);

    return (
        <>
            <div>
                Time: {time/1000}
            </div>
        </>
    );
}

export default Stopwatch;