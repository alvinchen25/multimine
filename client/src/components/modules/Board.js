import React, { Component, useState } from "react";
import url from "socket.io-client/lib/url";
import "./Board.css";
import Cell from "./Cell";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";

/**
* PropTypes
* @param {Number} height
* @param {Number} width
* @param {Number} mines
* @param {String} room this is the room ID
* @param {Array[Number]} mineList List of 0's and 1's where the 1's indicate mines
* setProgress sets the state of progress
*/

const Board = (props) => {
    let currentProgress = 0;

    let data = Array(props.height*props.width).fill(0);

    const bounds = (x,y) => {
        let ok = (0 <= x) && (x < props.height) && (0 <= y) && (y < props.width);
        return ok;
    }
    
    const getInitState = () => {
        let initState = [];
        for(let i=0;i<props.height;++i){
            let row = [];
            for(let j=0;j<props.width;++j){
                row.push({
                    hidden: true,
                    mine: false, 
                    flag: false,
                    adjMines: 0,
                    status: 'block',
                    
                });
            }
            initState.push(row);
        }

        for(let i=0;i<props.height;++i){
            for(let j=0;j<props.width;++j){
                if(props.mineList[i][j] === 1){
                    initState[i][j].mine = true;
                }
            }
        }
        
        
        for(let i=0;i<props.height;++i){
            for(let j=0;j<props.width;++j){
                let adjCount = 0;
                for(let x=-1;x<=1;++x){
                    for(let y=-1;y<=1;++y){
                        if(bounds(i+x,j+y) && initState[i+x][j+y].mine){
                            ++adjCount;
                        }
                    }
                }
                initState[i][j].adjMines = adjCount;
            }
        }
        return initState;
    }

    const [cellState, setCellState] = useState(getInitState());
    
    const revealCell = (i,j) => {
        if(cellState[i][j].flag){
            return;
        }

        let uCellState = [...cellState];
        
        if(cellState[i][j].hidden){

            uCellState[i][j].hidden = false;
            if(cellState[i][j].mine){
                uCellState[i][j].status = 'mine';
            }else{
                currentProgress++;

                let mines = cellState[i][j].adjMines;

                if(mines !== 0){
                    uCellState[i][j].status = 'num-' + mines.toString(); 
                }else{
                    uCellState[i][j].status = 'empty';
                    for(let x=-1;x<=1;++x){
                        for(let y=-1;y<=1;++y){
                            if(bounds(i+x,j+y) && cellState[i+x][j+y].hidden){
                                revealCell(i+x,j+y);
                            }
                        }
                    }
                }
                
            }
            
        }else{
            if(!cellState[i][j].mine && cellState[i][j].adjMines !== 0){
                let adjCount = 0;
                for(let x=-1;x<=1;++x){
                    for(let y=-1;y<=1;++y){
                        if(bounds(i+x,j+y) && (cellState[i+x][j+y].flag || (cellState[i+x][j+y].mine && !cellState[i+x][j+y].hidden))){
                            adjCount++;
                        }
                    }
                }
                if(adjCount === cellState[i][j].adjMines){
                    for(let x=-1;x<=1;++x){
                        for(let y=-1;y<=1;++y){
                            if(bounds(i+x,j+y) && cellState[i+x][j+y].hidden){
                                revealCell(i+x,j+y);
                            }
                        }
                    }
                }
            }
        }

        setCellState(uCellState);
        socket.emit("progressUpdate",{progress: currentProgress+props.progress, room: props.room});
        if (currentProgress+props.progress >= (props.width*props.height-props.mines)) {
            socket.emit("endGame", {room: props.room, socketid: socket.id});
            const body = {userId: props.userId, room: props.room};
            post("/api/addHighScore", body);
        }
        props.setProgress(currentProgress+props.progress);
    }

    const flagCell = (i,j) => {
        let uCellState = [...cellState];

        if(cellState[i][j].hidden){
            if(cellState[i][j].flag){
                uCellState[i][j].flag = false;
                uCellState[i][j].status = 'block';
            }else{
                uCellState[i][j].flag = true;
                uCellState[i][j].status = 'flag';
            }
        }

        setCellState(uCellState);
    }
    
    
    return (
        <>
            {data.map((x, i) => (
                <div key = {i} className = { 'cell '+ cellState[Math.floor(i/props.width)][i%props.width].status} onClick = {() => revealCell(Math.floor(i/props.width), i%props.width)} onContextMenu = {(e) => {e.preventDefault(), flagCell(Math.floor(i/props.width), i%props.width)}}>
                    <Cell />
                </div>
                    
            ))}
            
        </>
    );
    

};

export default Board;