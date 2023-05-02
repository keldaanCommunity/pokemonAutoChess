import { Orientation } from "../types/enum/Game"
import PokemonEntity from "../core/pokemon-entity"
import Board from "../core/board"

export const OrientationVector: Record<Orientation, [number, number]> = {
    [Orientation.UP]: [0,1],
    [Orientation.UPRIGHT]: [1,1],
    [Orientation.RIGHT]: [1,0],
    [Orientation.DOWNRIGHT]: [1,-1],
    [Orientation.DOWN]: [0,-1],
    [Orientation.DOWNLEFT]: [-1,-1],
    [Orientation.LEFT]: [-1,0],
    [Orientation.UPLEFT]: [-1,1],
}

export const OrientationArray: Orientation[] = [
    Orientation.UP,
    Orientation.UPRIGHT,
    Orientation.RIGHT,
    Orientation.DOWNRIGHT,
    Orientation.DOWN,
    Orientation.DOWNLEFT,
    Orientation.LEFT,
    Orientation.UPLEFT
]

export function effectInLine(
    board: Board,
    pokemon: PokemonEntity,
    orientation: Orientation,
    effect: (target: PokemonEntity) => void
){

    const targetsHit = new Set()

    const applyEffect = (x: number, y: number) => {
        const targetInLine = board.getValue(x, y)
        if(targetInLine != null){
            effect(targetInLine)
            targetsHit.add(targetInLine)
        }
    }

    switch(orientation){
        case Orientation.UP:
            for(let y=pokemon.positionY+1; y<board.rows; y++){
                applyEffect(pokemon.positionX, y)
            }
            break;

        case Orientation.UPRIGHT:
            for(let x=pokemon.positionX+1, y=pokemon.positionY+1; x<board.columns && y<board.rows; x++, y++){
                applyEffect(x, y)
            }
            break;

        case Orientation.RIGHT:
            for(let x=pokemon.positionX+1; x<board.rows; x++){
                applyEffect(x, pokemon.positionY)
            }
            break;

        case Orientation.DOWNRIGHT:
            for(let x=pokemon.positionX+1, y=pokemon.positionY-1; x<board.columns && y>=0; x++, y--){
                applyEffect(x, y)
            }
            break;

        case Orientation.DOWN:
            for(let y=pokemon.positionY-1; y>=0; y--){
                applyEffect(pokemon.positionX, y)
            }
            break;

        case Orientation.DOWNLEFT:
            for(let x=pokemon.positionX-1, y=pokemon.positionY-1; x>=0 && y>=0; x--, y--){
                applyEffect(x, y)
            }
            break;

        case Orientation.LEFT:
            for(let x=pokemon.positionX-1; x>=0; x--){
                applyEffect(x, pokemon.positionY)
            }
            break;

        case Orientation.UPLEFT:
            for(let x=pokemon.positionX-1, y=pokemon.positionY+1; x>=0 && y<board.rows; x--, y++){
                applyEffect(x, y)
            }
            break;
    }
}