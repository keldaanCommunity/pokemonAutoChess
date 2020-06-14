class PokemonState {
    constructor() {

    }

    handleDamage(pokemon, damage, board) {
        pokemon.life -= damage;
        //console.log(`${pokemon.id} took ${damage} and has now ${pokemon.life} life`);
        if(pokemon.life <= 0){
            board.setValue(pokemon.positionX, pokemon.positionY, undefined);
        }
    }

    update(pokemon, dt, board) {
    }

    onEnter(pokemon) {
    }

    onExit(pokemon) {
    }

    isTargetInRange(pokemon, board){
        let targetInRange = false;
        let cellsInRange = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
        cellsInRange.forEach((cell) => {
            if(cell.value !== undefined && cell.value.team != pokemon.team)
            {
                targetInRange = true;
            }
        });
        return targetInRange;
    }

    getTargetInRange(pokemon, board){
        let cellsInRange = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
        for (let i = 0; i < cellsInRange.length; i++) {
            if(cellsInRange[i].value !== undefined && cellsInRange[i].value.team != pokemon.team){
                return cellsInRange[i].value;
            }
        }
    }
    
    isTarget(pokemon, board){
        let target = false;
        board.forEach((x,y,value) => {
            if(value && value.team != pokemon.team){
                target = true;
            }
        });
        return target;
    }

    getNearestTargetCoordinate(pokemon, board){
        let x;
        let y;
        let distance = 999;
        board.forEach((r,c,value) => {
            if(value !== undefined && value.team != pokemon.team){
                let candidateDistance = board.distanceM(pokemon.positionX,pokemon.positionY,r,c);
                if(candidateDistance < distance){
                    distance = candidateDistance;
                    x = r;
                    y = c;
                }      
            }
        });
        return [x,y];
    }
};

module.exports = PokemonState;