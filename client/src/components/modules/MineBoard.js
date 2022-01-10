import React, { Component, useState } from "react";
import "./MineBoard.css";

// const gameBoard = document.getElementById("game-board");

// const BoardColumns = 30;
// const BoardRows = 16;
// const totalMines = 99;
// const penalty = 0;

// let Board = [];
// let mines = []
// const drawBoard = () => {
//     for(let i=0;i<BoardRows;i++){
//         row = []
//         for(let j=0;j<30;j++){
//             const squareElement = document.createElement("div");
//             squareElement.style.gridRowStart = i+1;
//             squareElement.style.gridColumnStart = j+1;
//             squareElement.classList.add("hidden");
//             squareElement.innerHTML = blockpic;

//             gameBoard.appendChild(squareElement);

//             row.push({
//                 x: i,
//                 y: j,
//                 ismine: false,
//                 opened: false,
//                 flagged: false,
//                 adjmines: 0,
//                 squareElement: squareElement
//             });

            
//         }
//         Board.push(row);
//     }
// }
// const clickable = () => { // make the clicks work.
//     for(let i=0;i<BoardRows;++i){
//         for(let j=0;j<BoardColumns;++j){
//             Board[i][j].squareElement.addEventListener("click", () => {
//                 clickCell(Board[i][j]);
//             });
//             Board[i][j].squareElement.addEventListener("auxclick", () => {
//                 rightClickCell(Board[i][j]);
//             });
//         }
//     }
// }
// const placeMines = () => { // initialize mines
//     let mines = [];
//     let count = 0;
//     while(count < totalMines){
//         row = Math.floor(Math.random()*16);
//         col = Math.floor(Math.random()*30);

//         let okay = true;
//         mines.forEach((mine) => {
//             if(mine.x === row && mine.y === col){
//                 okay = false;
//             }
//         })
//         if(okay){
//             count++;
//             mines.push({
//                 x: row,
//                 y: col,
//             });
//             Board[row][col].ismine = true;
//         }
//     }

//     for(let i=0;i<16;++i){ // counts number of adjacent mines to a given mine
//         for(let j=0;j<30;++j){
//             if(!Board[i][j].ismine){
//                 let adj = 0
//                 for(let x=-1;x<=1;++x){
//                     for(let y=-1;y<=1;++y){
//                         if(0 <= i+x && i+x < BoardRows && 0 <= j+y && j+y < BoardColumns && Board[i+x][j+y].ismine){
//                             adj++;
//                         }
//                     }
//                 }
//                 Board[i][j].adjmines = adj;
//             }
//         }
//     }
// }
// const revealBlock = (cell) => { 
//     cell.opened = true;
//     if(cell.adjmines !== 0){
//         cell.squareElement.innerHTML = numpics[cell.adjmines-1];
//     }else{
//         cell.squareElement.innerHTML = emptypic;
//         for(let x = -1;x <= 1; ++x){
//             for(let y = -1;y <= 1; ++y){
//                 row = cell.x + x;
//                 col = cell.y + y;
//                 if(0 <= row && row < BoardRows && 0 <= col && BoardRows < BoardColumns && !Board[row][col].opened){
//                     revealBlock(Board[row][col]);
//                 }
//             }
//         }
//     }
// }
// drawBoard();
// clickable();
// placeMines();

// const flagpic = '<img src="../../public/images/flagged.png" className="block">';
// const blockpic = '<img src="../../public/images/block.png" className="block">';
// const numpics = [
//     '<img src="../../public/images/one.png" className="block">',
//     '<img src="../../public/images/two.png" className="block">',
//     '<img src="../../public/images/three.png" className="block">',
//     '<img src="../../public/images/four.png" className="block">',
//     '<img src="../../public/images/five.png" className="block">',
//     '<img src="../../public/images/six.png" className="block">',
//     '<img src="../../public/images/seven.png" className="block">',
//     '<img src="../../public/images/eight.png" className="block">'];

// const emptypic = '<img src="../../public/images/empty.png" className="block">';
// const minepic = '<img src="../../public/images/mine.png" className="block">';

// const clickCell = (yeet) => { 
//     if (yeet.flagged === true) {
//         //nothing happens when you click a flagged square!
//     }
//     else if (yeet.opened === false) {
        
//         if (yeet.ismine === true) {
//             yeet.squareElement.innerHTML = minepic;
//             yeet.opened = true;
//             penalty += 10;
//             // Have some sort of freezing animation
//         }
//         else {
//             revealBlock(yeet);
//         }
//     }
//     else {
//         // do this function later, should be clicking an uncovered cell with all things flagged
//         if (yeet.opened === true && yeet.adjmines>0 && yeet.adjmines === adjRevealedMinePlusFlagNumber(yeet)) {
//             for(let x = -1;x <= 1; ++x){
//                 for(let y = -1;y <= 1; ++y){
//                     row = yeet.x + x;
//                     col = yeet.y + y;
//                     if(0 <= row && row < BoardRows && 0 <= col && col < BoardColumns && !Board[row][col].opened){
//                         if (Board[row][col].ismine === true && Board[row][col].flagged === true) {
//                             // if it's flagged already then it doesn't matter
//                         }
//                         else if (Board[row][col].ismine === true) {
//                             Board[row][col].squareElement.innerHTML = minepic;
//                             Board[row][col].opened = true;
//                             // apply mine penalty
//                         }
//                         else if (Board[row][col].flagged === true) {
//                             //nothing happens xd
//                         }
//                         else { // Reveal the square if it's not a mine an it's not flagged
//                             revealBlock(Board[row][col]);
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

// const rightClickCell = (yeet) => { // allows you to flag and unflag by right clicking
//     if (yeet.opened === false) {
//         if (yeet.flagged === true) {
//             yeet.squareElement.innerHTML = blockpic;
//             yeet.flagged = false;
//         }
//         else {
//             yeet.squareElement.innerHTML = flagpic;
//             yeet.flagged = true;
//         }    
//     }
// }

// const adjFlagNumber = (yeet) => {
//     let flags = 0;
//     for(let x = -1;x <= 1; ++x){
//         for(let y = -1;y <= 1; ++y){
//             row = yeet.x + x;
//             col = yeet.y + y;
//             if(0 <= row && row < BoardRows && 0 <= col && col < BoardColumns && Board[row][col].flagged){
//                 flags += 1;
                
//             }
//         }
//     }
//     return flags;
// }
// const adjRevealedMinePlusFlagNumber = (yeet) => {
//     let revealedmines = 0;
//     for(let x = -1;x <= 1; ++x){
//         for(let y = -1;y <= 1; ++y){
//             row = yeet.x + x;
//             col = yeet.y + y;
//             if(0 <= row && row < BoardRows && 0 <= col && col < BoardColumns && Board[row][col].ismine === true && Board[row][col].opened === true){
//                 revealedmines += 1;
//             }
//         }
//     }
//     return revealedmines + adjFlagNumber(yeet);
// }

// we need a completion clause

class MineBoard extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     userId: null,
        // }
    }
    componentWillUnmount() {
        // clearInterval(this.interval);
    }

    
    
    render() {
        return (
            <>
                <head>
                    {/* <link rel="stylesheet" href="style.css" /> */}
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                    <title>Multimine</title>
                    {/* <script src="grid.js"></script>
                    <script src="input.js"></script>
                    <script src="game.js" defer></script> */}
                </head>
                <body>
                    <div oncontextmenu="return false;" id="game-board"></div>
                    {/* <div> Penalty: {penalty} </div> */}
                    {/* <div> Total Mines: {}</div> */}
                </body>
            </>
        );
    }

}

export default MineBoard;