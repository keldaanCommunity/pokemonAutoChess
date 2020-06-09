const STATE_TYPE = require('../models/enum').STATE_TYPE;
const PokemonState = require('./pokemon-state');

class MovingState extends PokemonState {
    constructor() {
        super();
        this.cooldown = 0;
    }

    handleDamage(pokemon, damage) {
        super.handleDamage(pokemon, damage);
    }

    update(pokemon, dt, board) {
        
        super.update(pokemon, dt, board);
        if(this.cooldown <= 0){
            this.move(pokemon, board);
            this.cooldown = 1000;
        }
        else{
            this.cooldown = Math.max(0, this.cooldown - dt); 
        }
    }

    move(pokemon, board){
        let cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
        let moved = false;
        cells.forEach(cell => {
            if(cell.value == undefined && !moved){
                moved = true;
                board.moveValue(pokemon.positionX, pokemon.positionY, cell.row, cell.column);
                pokemon.positionX = cell.row;
                pokemon.positionY = cell.column;
            }
        });
    }

    onEnter(pokemon) {
        super.onEnter(pokemon);
        pokemon.action = STATE_TYPE.MOVING;
    }

    onExit(pokemon) {
        super.onExit(pokemon);
    }
}

module.exports = MovingState;