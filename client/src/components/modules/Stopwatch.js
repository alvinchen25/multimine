import React, { useEffect, useState } from "react";

import "./ProgressBars.css";
import { socket } from "../../client-socket.js";

/** Proptypes
* 
*/

const Stopwatch = (props) => {
    const [time, setTime] = useState(0);
   
    return (
        <>
            <div>
                Time: {time/1000}
            </div>
        </>
    );
}

export default Stopwatch;