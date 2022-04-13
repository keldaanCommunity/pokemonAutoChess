import React from 'react';
import {TYPE_DETAILS, TYPE_TRADUCTION, PRECOMPUTED_TYPE_POKEMONS, RARITY_COLOR, CDN_URL} from '../../../../../models/enum';
import PokemonFactory from '../../../../../models/pokemon-factory';

export default function GameSynergyDetail(props:{type: string, value: number}) {
    return <div>
    <div style={{display:'flex'}}>
       <img style={{width:'40px', height:'40px', marginRight:'10%'}} src={'assets/types/' + props.type + '.png'}/>
       <h3>{TYPE_TRADUCTION[props.type].eng}</h3>
   </div>
    
    {TYPE_DETAILS[props.type].description.eng.map((d,i)=>{
        return <div key={i} style={{
            color: d.trigger <= props.value ? '#000000' : '#808080'
        }}>
               <h5>{d.title}</h5>
               <p>{d.text}</p>
            </div>
    })}
   <div style={{display:'flex'}}>
   {PRECOMPUTED_TYPE_POKEMONS[props.type].pokemons.map(p=>{
       const s = {border : '3px solid ' + RARITY_COLOR[PokemonFactory.getPokemonRarityFromName(p)]};
       return <img key={p} style={s} src={CDN_URL + p + '.png'}/>    
   })}
   </div>
   <div style={{display:'flex', marginTop:'10px'}}>
   {PRECOMPUTED_TYPE_POKEMONS[props.type].mythicalPokemons.map(p=>{
       const s = {border : '3px solid ' + RARITY_COLOR[PokemonFactory.getPokemonRarityFromName(p)]};
       return <img key={p} style={s} src={CDN_URL + p + '.png'}/>    
   })}
   </div>
</div>
}
