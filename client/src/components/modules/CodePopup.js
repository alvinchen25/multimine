import React, {useEffect, useState} from "react";
import "./CodePopup.css";

const CodePopup = (props) => {
    useEffect(() => {
        console.log(props.room);
    }, []);
    const [value, setValue] = useState("room code");
    const handleChange = (event) => {
        setValue(event.target.value);
    };
    return (
        <div className = "popup-box"> 
            <div className = "box">
                <span className = "close-icon" onClick = {props.handleClose}>x</span>
                <h3> Enter Code Bro: </h3>
                <input type="text" value={value} onChange = {handleChange} />
                <button
                    type="submit"
                    value="Submit"
                    onClick={() => props.checkCode(value, props.room)}
                >
                Submit
                </button>
            </div>
        </div>
    );
};

export default CodePopup;