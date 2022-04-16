import React, { Component } from 'react';
import { TYPE_DETAILS, TYPE_TRADUCTION, CDN_URL } from '../../../../../models/enum';
import { Emotion } from '../../../../../types';
import PokemonFactory from '../../../../../models/pokemon-factory';
import PRECOMPUTED_TYPE_POKEMONS_ALL from '../../../../../models/precomputed/type-pokemons-all.json';

class WikiType extends Component {
  render() {
    return <div>
        <div style={{display:'flex'}}>
            <img src={"assets/types/" + this.props.type + ".png"}></img>
            <p>{TYPE_TRADUCTION[this.props.type].eng}</p>
        </div>
        {TYPE_DETAILS[this.props.type].description.eng.map(info=>{
            return <div key={info.title} style={{display:'flex'}}>
                <p>
                    {info.title}: 
                </p>
                <p>
                    {info.text}
                </p>
            </div>
        })}
        <div style={{display:'flex', flexWrap:'wrap'}}>
            {PRECOMPUTED_TYPE_POKEMONS_ALL[this.props.type].map(p=>{
                const pokemon = PokemonFactory.createPokemonFromName(p);
                return <img key={p} src={`${CDN_URL}${pokemon.index.replace('-','/')}/${Emotion.NORMAL}.png`}></img>
            })}
        </div>
    </div>;
  }
}
export default WikiType;
