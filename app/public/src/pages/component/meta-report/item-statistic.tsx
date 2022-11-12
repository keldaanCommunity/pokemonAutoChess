import React from 'react'
import { ItemName } from '../../../../../types/strings/Item'
import { PkmIndex } from '../../../../../types/enum/Pokemon'
import CSS from 'csstype'
import { IItemsStatistic } from '../../../../../models/mongo-models/items-statistic'
import { getPortraitSrc } from '../../../utils'

const pStyle={
    fontSize:'1.1vw'
}

export default function ItemStatistic(props: {item: IItemsStatistic}){
    const imgStyle: CSS.Properties = {width:'60px', height:'60px', imageRendering:'pixelated'}

    return <div style={{backgroundColor:'rgb(84, 89, 107)', margin:'10px'}} className='nes-container'>
        <div style={{display:'flex', justifyContent:'space-between'}}>
        <img style={imgStyle} src={'assets/item/' + props.item.name + '.png'}></img>
            <p style={pStyle}>{ItemName[props.item.name]}</p>
            <p style={pStyle}>Average Place: {props.item.rank}</p>
            <p style={pStyle}>Count: {props.item.count}</p>
            <div style={{display:'flex'}}>
                {props.item.pokemons.map(pokemon=>{
                    return <div style={{display:'flex', flexFlow:'column', alignItems: 'center'}} key={pokemon}>
                    <img style={imgStyle} src={getPortraitSrc(PkmIndex[pokemon])}/>
                </div> 
                })}
            </div>
        </div>
    </div>
}