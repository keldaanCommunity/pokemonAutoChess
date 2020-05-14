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
        let x = undefined;
        let y = undefined;
        let distance = 999;
        board.forEach((r,c,value) => {
            if(value !== undefined && value.team != pokemon.team){
                let candidateDistance = board.distance(pokemon.positionX,pokemon.positionY,r,c);
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