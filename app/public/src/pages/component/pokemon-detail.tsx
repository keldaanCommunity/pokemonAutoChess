import React from 'react';
import PokemonFactory from '../../../../models/pokemon-factory';
import {RARITY_COLOR, SPECIAL_SKILL_DESCRIPTION} from '../../../../models/enum';
import credits from '../../../dist/client/assets/pokemons/credits.json';



export default function PokemonDetail(props:{pokemon: string}) {
    const pokemon = PokemonFactory.createPokemonFromName(props.pokemon);
    const normalCredit = credits[`${pokemon.index}-Normal`] !== undefined ? credits[`${pokemon.index}-Normal`]: {date:'', author:''};
    const shinyCredit = credits[`${pokemon.index}-Shiny`] !== undefined ? credits[`${pokemon.index}-Shiny`]: {date:'', author:''};

  return (            
      <div style={{display: 'flex'}}>
          <div style={{width: '30%'}}>
              <p>name:{pokemon.name}</p>
              <p>Author:{normalCredit.author}</p>
              <p>Created at: {normalCredit.date}</p>
              <p>Shiny Author: {shinyCredit.author}</p>
              <p>Shiny created at: {shinyCredit.date}</p>
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
              <p>Ability: {SPECIAL_SKILL_DESCRIPTION[pokemon.skill].title.eng}</p>
              <p>Description:{SPECIAL_SKILL_DESCRIPTION[pokemon.skill].description.eng}</p>
          </div>
      </div>
  );
}