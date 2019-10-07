class Player
{
    constructor(socketId){
        this.socketId = socketId;
        this.board = [];
        this.team = [];
        this.shop = [];
        this.level = 2;
    }
}

module.exports = Player;