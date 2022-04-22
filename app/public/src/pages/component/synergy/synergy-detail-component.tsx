import React from 'react';
import {RARITY_COLOR, CDN_PORTRAIT_URL} from '../../../../../models/enum';
import PokemonFactory from '../../../../../models/pokemon-factory';
import { Emotion } from '../../../../../types';
import { Synergy } from '../../../../../types/enum/Synergy';
import { SynergyName, SynergyDetail } from '../../../../../types/strings/Synergy';
import PRECOMPUTED_TYPE_POKEMONS from '../../../../../models/precomputed/type-pokemons.json';


export default function SynergyDetailComponent(props:{type: Synergy, value: number}) {
    return <div>
    <div style={{display:'flex'}}>
       <img style={{width:'40px', height:'40px', marginRight:'10%'}} src={'assets/types/' + props.type + '.png'}/>
       <h3>{SynergyName[props.type].eng}</h3>
   </div>
    
    {SynergyDetail[props.type].description.eng.map((d,i)=>{
        return <div key={i} style={{
            color: d.trigger <= props.value ? '#000000' : '#808080'
        }}>
               <h5>{d.title}</h5>
               <p>{d.text}</p>
            </div>
    })}
   <div style={{display:'flex'}}>
   {PRECOMPUTED_TYPE_POKEMONS[props.type].pokemons.map(p=>{
       const pokemon = PokemonFactory.createPokemonFromName(p);
       const s = {border : '3px solid ' + RARITY_COLOR[pokemon.rarity]};
       return <img key={p} style={s} src={`${CDN_PORTRAIT_URL}${pokemon.index.replace('-','/')}/${Emotion.NORMAL}.png`}/>    
   })}
   </div>
   <div style={{display:'flex', marginTop:'10px'}}>
   {PRECOMPUTED_TYPE_POKEMONS[props.type].mythicalPokemons.map(p=>{
       const pokemon = PokemonFactory.createPokemonFromName(p);
       const s = {border : '3px solid ' + RARITY_COLOR[pokemon.rarity]};
       return <img key={p} style={s} src={`${CDN_PORTRAIT_URL}${pokemon.index.replace('-','/')}/${Emotion.NORMAL}.png`}/>   
   })}
   </div>
</div>
}
