import React from 'react';
import {CDN_PORTRAIT_URL} from '../../../../../types';
import { ItemName } from '../../../../../types/strings/Item';
import { Emotion } from '../../../../../types';
import { PkmIndex } from '../../../../../types/enum/Pokemon';
import CSS from 'csstype';
import { IItemsStatistic } from '../../../../../models/mongo-models/items-statistic';


export default function ItemStatistic(props: {item: IItemsStatistic}){
    const imgStyle: CSS.Properties = {width:'60px', height:'60px', imageRendering:'pixelated'};

    return <div style={{backgroundColor:'rgba(255,255,255,1)', margin:'10px'}} className='nes-container'>
        <div style={{display:'flex', justifyContent:'space-between'}}>
        <img style={imgStyle} src={'assets/item/' + props.item.name + '.png'}></img>
            <p>{ItemName[props.item.name]}</p>
            <p>Average Place: {props.item.rank}</p>
            <p>Count: {props.item.count}</p>
            <div style={{display:'flex'}}>
                {props.item.pokemons.map(pokemon=>{
                    return <div style={{display:'flex', flexFlow:'column', alignItems: 'center'}} key={pokemon}>
                    <img style={imgStyle} src={`${CDN_PORTRAIT_URL}${PkmIndex[pokemon].replace('-','/')}/${Emotion.NORMAL}.png`}/>
                </div> 
                })}
            </div>
        </div>
    </div>
}