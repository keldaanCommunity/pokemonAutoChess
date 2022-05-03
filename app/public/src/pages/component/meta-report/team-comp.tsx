import React from 'react';
import { CDN_PORTRAIT_URL } from '../../../../../models/enum';
import { IMeta } from '../../../../../models/mongo-models/meta';
import { Emotion } from '../../../../../types';
import { Pkm, PkmIndex } from '../../../../../types/enum/Pokemon';
import { Synergy } from '../../../../../types/enum/Synergy';


function capitalizeFirstLetter(string: string) {
    if(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    else{
        return null
    }
}

export default function TeamComp(props:{team:IMeta}){
    const sortedTypes = props.team.types ? (Object.keys(props.team.types) as Synergy[]).sort((a,b)=>{return props.team.types[b] - props.team.types[a]}) : new Array<Synergy>();
    const sortedPokemons = props.team.pokemons ? (Object.keys(props.team.pokemons) as Pkm[]).sort((a,b)=>{return props.team.pokemons[b] - props.team.pokemons[a]}) : new Array<Pkm>();

    return <div style={{backgroundColor:'rgba(255,255,255,1)', margin:'10px'}} className='nes-container'>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{display:'flex'}}>
                {sortedTypes.map(type=>{
                    return <div style={{display:'flex', flexFlow:'column', alignItems: 'center'}} key={type}>
                        <img style={{width:'51px', height:'51px', imageRendering:'pixelated', marginRight:'4px'}} src={'assets/types/' + type.toUpperCase() + '.png'}/>
                        <p>{props.team.types[type]}</p>
                    </div> 
                })}
            </div>
            <h3 style={{position:'absolute', left:'32.5%', top:'20px'}}>{capitalizeFirstLetter(sortedTypes[0])} {props.team.types[sortedTypes[0]]} / {capitalizeFirstLetter(sortedTypes[1])} {props.team.types[sortedTypes[1]]}</h3>
            <div style={{display:'flex'}}>
                {sortedPokemons.map(pokemon=>{
                    return <div style={{display:'flex', flexFlow:'column', alignItems: 'center'}} key={pokemon}>
                    <img style={{width:'60px', height:'60px', imageRendering:'pixelated'}} src={`${CDN_PORTRAIT_URL}${PkmIndex[pokemon].replace('-','/')}/${Emotion.NORMAL}.png`}/>
                    <p>{props.team.pokemons[pokemon].toFixed(1)}</p>
                </div> 
                })}
            </div>
        </div>

        <div style={{display: 'flex', justifyContent:'space-between'}}>
            <p>Average Place: {props.team.mean_rank.toFixed(2)}</p>
            <p>Winrate: {props.team.winrate.toFixed(2)} %</p>
            <p>Popularity: {props.team.ratio.toFixed(2)} %</p>
            <p>Count: {props.team.count}</p>
        </div>
    </div>
}