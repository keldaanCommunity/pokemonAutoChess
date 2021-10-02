import React, { Component } from 'react';
import PokemonFactory from '../../../../models/pokemon-factory';
import {RARITY_COLOR, SPECIAL_SKILL_DESCRIPTION} from '../../../../models/enum';

class PokemonDetail extends Component {
  render() {
      let pokemon = PokemonFactory.createPokemonFromName(this.props.pokemon);
    return (            
        <div style={{display: 'flex'}}>
            <div style={{width: '30%'}}>
                <p>name:{pokemon.name}</p>
                <p style={{color:RARITY_COLOR[pokemon.rarity]}}>rarity:{pokemon.rarity}</p>
                <div>
                    types:{pokemon.types.map(type=>{
                        return <img key={'img'+type} src={'assets/types/'+type+'.png'}/>
                    })}
                </div>
                <div>evolution: {pokemon.evolution == ''? 'No evolution': <img src={'assets/avatar/'+pokemon.evolution+'.png'}/>}</div>
            </div>
            <div style={{width: '30%'}}>
                <p>Health: {pokemon.hp}</p>
                <p>Attack: {pokemon.atk}</p>
                <p>Defense: {pokemon.def}</p>
                <p>Special Defense: {pokemon.speDef}</p>
                <p>Range: {pokemon.range}</p>
                <p>Mana: {pokemon.maxMana}</p>
            </div>
            <div style={{width: '30%'}}>
                <p>Abilty: {SPECIAL_SKILL_DESCRIPTION[pokemon.skill].title.eng}</p>
                <p>Description:{SPECIAL_SKILL_DESCRIPTION[pokemon.skill].description.eng}</p>
            </div>
        </div>
    );
  }
}
export default PokemonDetail;
