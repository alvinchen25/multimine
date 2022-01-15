import React, { Component, useState } from "react";
import url from "socket.io-client/lib/url";
import "./Board.css";
import Cell from "./Cell";

/*
* PropTypes
* setProgress sets the state of progress
*/

const Board = (props) => {
    let currentProgress = 0;

    let data = Array(30*16).fill(0);

    const bounds = (x,y) => {
        let ok = (0 <= x) && (x < 16) && (0 <= y) && (y < 30);
        return ok;
    }
    
    const getInitState = () => {
        let initState = [];
        for(let i=0;i<16;++i){
            let row = [];
            for(let j=0;j<30;++j){
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

        for(let i=0;i<16;++i){
            for(let j=0;j<30;++j){
                if(props.mineList[i][j] === 1){
                    initState[i][j].mine = true;
                }
            }
        }
        
        
        for(let i=0;i<16;++i){
            for(let j=0;j<30;++j){
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
                // props.updateProgress();
                // console.log("wowo");
                currentProgress++;
                // props.progress++;
                // props.setProgress(props.progress);
                

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
                <div key = {i} className = 'cell' className = {cellState[Math.floor(i/30)][i%30].status} onClick = {() => revealCell(Math.floor(i/30), i%30)} onContextMenu = {(e) => {e.preventDefault(), flagCell(Math.floor(i/30), i%30)}}>
                    <Cell />
                </div>
                    
            ))}
            
        </>
    );
    

};

export default Board;