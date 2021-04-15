const SCENARIOS = require('../app/models/scenarios');
const {PKM} = require('../app/models/enum');

Object.keys(SCENARIOS).forEach(botName => {
    const bot = SCENARIOS[botName];
    if(bot.steps && bot.steps.length !=0){
        bot.steps.forEach((step, index) =>{
            if(step.roundsRequired === undefined || step.roundsRequired < 0){
                console.log(`problem with roudRequired bot (${botName})`);
            }
            else{
                if(step.board && step.board.length !=0){
                    let coordinates = [];
                    step.board.forEach(pokemon=>{
                        if(!pokemon.name || !Object.values(PKM).includes(pokemon.name)){
                            console.log(`error with pokemone name ${JSON.stringify(pokemon)} ${pokemon.name} in bot ${botName} at step ${index}`);
                        }
                        if(pokemon.x === undefined || pokemon.x <0 || pokemon.x >7){
                            console.log(`error with coordinate x ${pokemon.x} bot ${botName} pokemon ${pokemon.name} at step ${index}`);
                        }
                        if(pokemon.y === undefined || pokemon.y <1 || pokemon.y >3){
                            console.log(`error with coordinate y ${pokemon.y} bot ${botName} pokemon ${pokemon.name} at step ${index}`);
                        }
                        
                        let error = false;
                        let pokemonError = '';
                        coordinates.forEach(coord =>{
                            if(coord[0] == pokemon.x && coord[1] == pokemon.y){
                                error = true;
                                pokemonError = coord[2];
                            }
                        });
                        if(!error){
                            coordinates.push([pokemon.x, pokemon.y, pokemon.name]);
                        }
                        else{
                            console.log(`same coordinates detected x:${pokemon.x} y:${pokemon.y} bot ${botName}, pokemon ${pokemon.name} has the same coordinates than ${pokemonError} at step ${index}`);
                        }
                    });
                }
                else{
                    console.log(`problem with board bot ${botName}`);
                }
            }
        });
    }
    else{
        console.log(`problem with steps bot ${botName}`);
    }
});