const roomCode = {};

const initMines = () => {
    let mineArray = [];
    for(let i=0; i<16; i++) {
        let row = [];
        for (let j=0; j<30; j++) {
            row.push(0);
        }
        mineArray.push(row);
    }
    let curMines = 0;
    while(curMines < 99){
        let x = Math.floor(16*Math.random());
        let y = Math.floor(30*Math.random());
        if(mineArray[x][y] !== 1){
            curMines++;
            mineArray[x][y] = 1;
        }
    }
    return mineArray;
}

const genRoomCode = (room) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = "";
    for(let i=0;i<5;++i){
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}


module.exports = {initMines: initMines, genRoomCode: genRoomCode};