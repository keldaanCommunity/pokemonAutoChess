import React from 'react'
import {CDN_PORTRAIT_URL } from '../../../../../types'
import { Item } from '../../../../../types/enum/Item'
import {ItemDescription, ItemName} from '../../../../../types/strings/Item'
import {Emotion} from '../../../../../types'
import {Pkm} from '../../../../../types/enum/Pokemon'
import PokemonFactory from '../../../../../models/pokemon-factory'
import {RarityColor} from '../../../../../types/Config'
import CSS from 'csstype'

const entityStyle: CSS.Properties = {
    display: 'flex',
    position:'absolute',
    right:'0px',
    top:'8.5%',
    margin:'10px',
    marginTop:'0px',
    flexFlow:'column',
    width:'20%'
}

const imgStyle: CSS.Properties = {
    height:'80px',
    width:'80px',
    imageRendering:'pixelated'
}

export default function SelectedEntity(props: {entity: Item | Pkm}) {
    if(Object.keys(Item).includes(props.entity)){
        return <div className='nes-container' style={entityStyle}>
            <div style={{display:'flex'}}>
                <img style={imgStyle} src={'assets/item/' + props.entity + '.png'}/>
                <h3>{ItemName[props.entity]}</h3>
            </div>
            <p>{ItemDescription[props.entity]}</p>
    </div>
    }
    else if(Object.values(Pkm).includes(props.entity as Pkm)){
        const pokemon = PokemonFactory.createPokemonFromName(props.entity as Pkm)
        return <div className='nes-container' style={entityStyle}>
            <div style={{display:'flex'}}>
                <img style={imgStyle} src={`${CDN_PORTRAIT_URL}${pokemon.index.replace('-','/')}/${Emotion.NORMAL}.png`}/>
                <h3>{pokemon.name}</h3>
            </div>
            <p style={{color:RarityColor[pokemon.rarity]}}>rarity:{pokemon.rarity}</p>
            <div>
                types:{pokemon.types.map(type=>{
                    return <img key={'img'+type} src={'assets/types/'+type+'.svg'}/>
             })}
             </div>
            <p>Health: {pokemon.hp}</p>
            <p>Attack: {pokemon.atk}</p>
            <p>Defense: {pokemon.def}</p>
            <p>Special Defense: {pokemon.speDef}</p>
            <p>Range: {pokemon.range}</p>
            <p>Mana: {pokemon.maxMana}</p>
        </div>
    }
    else{
        return null
    }
}