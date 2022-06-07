import React from 'react'
import {CDN_PORTRAIT_URL} from '../../../../../types'
import PokemonFactory  from '../../../../../models/pokemon-factory'
import { Emotion, PrecomputedTypePokemon } from '../../../../../types'
import { Synergy } from '../../../../../types/enum/Synergy'
import { SynergyName, SynergyDetail } from '../../../../../types/strings/Synergy'
import PRECOMPUTED_TYPE_POKEMONS from '../../../../../models/precomputed/type-pokemons.json'
import { Pkm } from '../../../../../types/enum/Pokemon'
import { EffectDescription, EffectName } from '../../../../../types/strings/Effect'
import { TypeTrigger, RarityColor } from '../../../../../types/Config'

const precomputed = PRECOMPUTED_TYPE_POKEMONS as PrecomputedTypePokemon

export default function SynergyDetailComponent(props:{type: Synergy, value: number}) {
    return <div>
    <div style={{display:'flex'}}>
       <img style={{width:'40px', height:'40px', marginRight:'1%'}} src={'assets/types/' + props.type + '.png'}/>
       <h3>{SynergyName[props.type].eng}</h3>
   </div>
    
    {SynergyDetail[props.type].map((d,i)=>{
        return <div key={EffectName[d]} style={{
            color: TypeTrigger[props.type][i] <= props.value ? '#fff' : '#68829E'
        }}>
               <h5 style={{fontSize:'1.3vw'}}>({TypeTrigger[props.type][i]}) {EffectName[d]}</h5>
               <p style={{fontSize:'1vw'}}>{EffectDescription[d].eng}</p>
            </div>
    })}
   <div style={{display:'flex'}}>
   {precomputed[props.type].pokemons.map(p=>{
       const pokemon = PokemonFactory.createPokemonFromName(p as Pkm)
       const s = {border : '3px solid ' + RarityColor[pokemon.rarity]}
       return <img key={p} style={s} src={`${CDN_PORTRAIT_URL}${pokemon.index.replace('-','/')}/${Emotion.NORMAL}.png`}/>    
   })}
   </div>
   <div style={{display:'flex', marginTop:'10px'}}>
   {precomputed[props.type].mythicalPokemons.map(p=>{
       const pokemon = PokemonFactory.createPokemonFromName(p as Pkm)
       const s = {border : '3px solid ' + RarityColor[pokemon.rarity]}
       return <img key={p} style={s} src={`${CDN_PORTRAIT_URL}${pokemon.index.replace('-','/')}/${Emotion.NORMAL}.png`}/>   
   })}
   </div>
</div>
}
