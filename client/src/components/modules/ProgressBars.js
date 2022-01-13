import React from "react";

import "./ProgressBars.css";

// PropTypes
/*
* There should be some array of objects which gives the userId as well as the progress for each user
* progressValues are passed in
*/

const ProgressBars = (props) => {
    return (
        <>
            <div> 
                Progress bars will be here 
            </div>
            <div>
                {props.progressValues}
            </div>
        </>
    );
}

export default ProgressBars;