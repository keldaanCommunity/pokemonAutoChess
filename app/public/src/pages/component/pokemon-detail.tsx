import React from 'react';
import PokemonFactory from '../../../../models/pokemon-factory';
import {RARITY_COLOR, SPECIAL_SKILL_DESCRIPTION} from '../../../../models/enum';
import { Convert } from '../../../../types/ITracker';
import tracker from '../../../../public/dist/client/assets/pokemons/tracker.json';
const metadata = Convert.toITracker(JSON.stringify(tracker));

export default function PokemonDetail(props:{pokemon: string}) {
    const pokemon = PokemonFactory.createPokemonFromName(props.pokemon);
    
  return (            
      <div style={{display: 'flex'}}>
          <div style={{width: '30%'}}>
              <p>name:{pokemon.name}</p>
              <p>Portrait Credit:</p>
              <ul>
                  <li><p>{metadata[pokemon.index].portrait_credit.primary}</p></li>
                  <li><p>{metadata[pokemon.index].portrait_credit.secondary}</p></li>
              </ul>
              <p>Sprite Credit:</p>
              <ul>
                  <li><p>{metadata[pokemon.index].sprite_credit.primary}</p></li>
                  <li><p>{metadata[pokemon.index].sprite_credit.secondary}</p></li>
              </ul>
              <p style={{color:RARITY_COLOR[pokemon.rarity]}}>rarity:{pokemon.rarity}</p>
              <div>
                  types:{pokemon.types.map(type=>{
                      return <img key={'img'+type} src={'assets/types/'+type+'.png'}/>
                  })}
              </div>
              <div>evolution: {pokemon.evolution == ''? 'No evolution': <img src={'https://raw.githubusercontent.com/keldaanInteractive/SpriteCollab/master/portrait/'+pokemon.evolution+'.png'}/>}</div>
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
              <p>Ability: {SPECIAL_SKILL_DESCRIPTION[pokemon.skill].title.eng}</p>
              <p>Description:{SPECIAL_SKILL_DESCRIPTION[pokemon.skill].description.eng}</p>
          </div>
      </div>
  );
}