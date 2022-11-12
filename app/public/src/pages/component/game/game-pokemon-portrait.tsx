import React from 'react'
import {Pokemon} from '../../../../../models/colyseus-models/pokemon'
import { IPokemonConfig } from '../../../../../models/mongo-models/user-metadata'
import {PkmCost, RarityColor} from '../../../../../types/Config'
import { getPortraitSrc } from '../../../utils'

export default function GamePokemonPortrait(props: {index: number, pokemon: Pokemon | undefined, pokemonConfig: IPokemonConfig | undefined, click: React.MouseEventHandler<HTMLDivElement>}) {
    
    if(!props.pokemon){
        return <div style={{
            width:'15%',
            marginRight:'1%',
            padding:'0px'
        }}/>
    }
    else{
        const rarityColor = RarityColor[props.pokemon.rarity]
        return <div className="nes-container" style={{
            imageRendering:'pixelated',
            width:'15%',
            backgroundColor: rarityColor,
            backgroundImage:`url("${getPortraitSrc(props.pokemon.index, props.pokemonConfig?.selectedShiny, props.pokemonConfig?.selectedEmotion)}")`,
            marginRight:'1%',
            padding:'0px',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            cursor:'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer'
        }}
        onClick={props.click}>

        <div style={{position:'absolute', left:'5px', bottom:'5px', display:'flex', alignItems:'center'}}>
            <p style={{fontSize:'1.2vw',
             textShadow:`
               -1px -1px 0 #fff,  
               1px -1px 0 #fff,
               -1px 1px 0 #fff,
                1px 1px 0 #fff`,
             margin:'0px'}}>{PkmCost[props.pokemon.rarity]}</p>
            <img style={{width:'20px', height:'20px'}} src="/assets/ui/money.png"/>
        </div>
        <ul style={{
            listStyleType:'none',
            padding:'0px',
            display:'flex',
            position: 'absolute',
            justifyContent:'space-evenly',
            right: '0px',
            flexFlow: 'column',
            top: '0px',
            height:'100%'
            }}>
            {props.pokemon.types.map(type=>{
                return <li key={type}><img src={'assets/types/'+ type +'.png'}/></li>
            })}
        </ul>
        </div>
    }
}

function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}