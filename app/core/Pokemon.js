class Pokemon{

    constructor(x, y, state){
        this.x = x;
        this.y = y;
        this.state = state;
    }

    update(){
        this.state.update();
    }

    handleAttack(){
        this.state.handleAttack();
    }
    
}

module.exports = Pokemon;