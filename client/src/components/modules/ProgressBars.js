import React from "react";

import "./ProgressBars.css";

// PropTypes
/*
* There should be some array of objects which gives the userId as well as the progress for each user
* progressValues are passed in
* userList is passed in
*/

const ProgressBars = (props) => {
    // const newUserList = props.userList.map((user) => (
    //     return (
    //         <div>
    //             aoeu
    //         </div>
    //     );
    // )};
    return (
        <>
            <div> 
                Progress bars will be here 
            </div>
            <div>
                {props.progressValues}
            </div>
            <div>
                This is the list of users in this room. We'll format it later.
                {props.userList}
            </div>
        </>
    );
}

export default ProgressBars;