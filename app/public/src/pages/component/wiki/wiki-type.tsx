import React from 'react'
import { CDN_PORTRAIT_URL } from '../../../../../types'
import { Emotion } from '../../../../../types'
import PokemonFactory from '../../../../../models/pokemon-factory'
import PRECOMPUTED_TYPE_POKEMONS_ALL from '../../../../../models/precomputed/type-pokemons-all.json'
import {SynergyName, SynergyDetail} from '../../../../../types/strings/Synergy'
import { EffectDescription, EffectName } from '../../../../../types/strings/Effect'
import {TypeTrigger} from '../../../../../types/Config'
import { Synergy } from '../../../../../types/enum/Synergy'
import {Pkm} from '../../../../../types/enum/Pokemon'


export default function WikiType(props:{type:Synergy}) {
    return <div>
        <div style={{display:'flex'}}>
            <img src={'assets/types/' + props.type + '.png'}></img>
            <p>{SynergyName[props.type].eng}</p>
        </div>
        {SynergyDetail[props.type].map((effect,i)=>{
            return <div key={EffectName[effect]} style={{display:'flex'}}>
                <p>
                    ({TypeTrigger[props.type][i]}) {EffectName[effect]}: 
                </p>
                <p>
                    {EffectDescription[effect].eng}
                </p>
            </div>
        })}
        <div style={{display:'flex', flexWrap:'wrap'}}>
            {(PRECOMPUTED_TYPE_POKEMONS_ALL[props.type] as Pkm[]).map(p=>{
                const pokemon = PokemonFactory.createPokemonFromName(p)
                return <img key={p} src={`${CDN_PORTRAIT_URL}${pokemon.index.replace('-','/')}/${Emotion.NORMAL}.png`}></img>
            })}
        </div>
    </div>
}

