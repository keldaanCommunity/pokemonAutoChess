import React from 'react';
import {Pokemon} from '../../../../../models/colyseus-models/pokemon';
import { COST, CDN_URL } from '../../../../../models/enum';
import { useAppDispatch } from '../../../hooks';
import { shopClick } from '../../../stores/NetworkStore';
import { IPokemonConfig } from '../../../../../models/mongo-models/user-metadata';
import { Emotion } from '../../../../../types';

const COLOR_TYPE = Object.freeze({
    COMMON: "rgba(104, 109, 125, 0.6)",
    UNCOMMON: "rgba(71, 138, 65, 0.6)",
    RARE: "rgba(80, 98, 171, 0.6)",
    EPIC: "rgba(123, 70, 156,0.6)",
    LEGENDARY: "rgba(166, 128, 46, 0.6)",
    MYTHICAL: "rgba(255, 222, 255, 0.6)",
    SUMMON: "#rgba(153, 31, 31, 0.6)"
  });

export default function GamePokemonPortrait(props: {index: number, pokemon: Pokemon, pokemonConfig: IPokemonConfig}) {
    const dispatch = useAppDispatch();
    
    if(!props.pokemon){
        return <div style={{
            width:'15.5%',
            marginRight:'1%'
        }}/>
    }
    else{
        const rarityColor = COLOR_TYPE[props.pokemon.rarity];
        return <div className="nes-container" style={{
            width:'15.5%',
            backgroundColor: rarityColor,
            marginRight:'1%',
            cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
        }}
        onClick={()=>{dispatch(shopClick(props.index))}}>
        <p style={{
            position:'absolute',
            bottom:'-10%',
            left:'1%',
            }}>{capitalizeFirstLetter(props.pokemon.name)}</p>
        <img style={{
            position:'absolute',
            left:'0%',
            top:'0%',
            width:'30%',
            imageRendering: 'crisp-edges'
            }} src={getPath(props.pokemon, props.pokemonConfig)} />
        <div style={{position:'absolute', right:'5%', top:'5%'}}>
            {COST[props.pokemon.rarity]}<img style={{width:'20px', marginBottom:'5px'}} src="/assets/ui/money.png"/>
        </div>
        <ul style={{
            listStyleType:'none',
            padding:'0px',
            position:'absolute',
            display:'flex',
            left:'35%',
            top:'30%'
            }}>
            {props.pokemon.types.map(type=>{
                return <li key={type}><img src={'assets/types/'+ type +'.png'}/></li>;
            })}
        </ul>
        </div>;
    }
}

function getPath(pokemon: Pokemon, config: IPokemonConfig) {
    const index = pokemon.index;
    
    let pokemonPath = CDN_URL;
    pokemonPath += index + '/';

    if(config && config.selectedShiny){
        pokemonPath += '0000/0001/';
    }

    if( config && config.selectedEmotion){
        pokemonPath += config.selectedEmotion;
    }
    else{
        pokemonPath += Emotion.NORMAL;
    }
    pokemonPath += '.png';
    return pokemonPath;
}

function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}