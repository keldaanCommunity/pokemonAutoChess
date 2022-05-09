import React, { Component } from 'react';
import { CDN_PORTRAIT_URL } from '../../../../../types';
import { Emotion } from '../../../../../types';
import PokemonFactory from '../../../../../models/pokemon-factory';
import PRECOMPUTED_TYPE_POKEMONS_ALL from '../../../../../models/precomputed/type-pokemons-all.json';
import {SynergyName, SynergyDetail} from '../../../../../types/strings/Synergy';
import { EffectDescription, EffectName } from '../../../../../types/strings/Effect';
import {TypeTrigger} from '../../../../../types/Config';

class WikiType extends Component {
  render() {
    return <div>
        <div style={{display:'flex'}}>
            <img src={"assets/types/" + this.props.type + ".png"}></img>
            <p>{SynergyName[this.props.type].eng}</p>
        </div>
        {SynergyDetail[this.props.type].map((effect,i)=>{
            return <div key={EffectName[effect]} style={{display:'flex'}}>
                <p>
                    ({TypeTrigger[this.props.type][i]}) {EffectName[effect]}: 
                </p>
                <p>
                    {EffectDescription[effect].eng}
                </p>
            </div>
        })}
        <div style={{display:'flex', flexWrap:'wrap'}}>
            {PRECOMPUTED_TYPE_POKEMONS_ALL[this.props.type].map(p=>{
                const pokemon = PokemonFactory.createPokemonFromName(p);
                return <img key={p} src={`${CDN_PORTRAIT_URL}${pokemon.index.replace('-','/')}/${Emotion.NORMAL}.png`}></img>
            })}
        </div>
    </div>;
  }
}
export default WikiType;
