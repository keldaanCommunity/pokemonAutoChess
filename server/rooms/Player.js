class Player
{
    constructor(socketId){
        this.socketId = socketId;
        this.board = [];
        this.team = [];
    }
}

module.exports = Player;