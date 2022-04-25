import React, { Component } from 'react';
import {CDN_PORTRAIT_URL} from '../../../../../models/enum';
import { ItemName } from '../../../../../types/strings/Item';
import PokemonFactory from '../../../../../models/pokemon-factory';
import { Emotion } from '../../../../../types';

class ItemStatistic extends Component{

    capitalizeFirstLetter(string) {
        if(string){
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        else{
            return null
        }
      }

    render(){
        const imgStyle = {width:'60px', height:'60px', imageRendering:'pixelated'};

        return <div style={{backgroundColor:'rgba(255,255,255,1)', margin:'10px'}} className='nes-container'>
            <div style={{display:'flex', justifyContent:'space-between'}}>
            <img style={imgStyle} src={'assets/item/' + this.props.item.name + '.png'}></img>
                <p>{ItemName[this.props.item.name]}</p>
                <p>Average Place: {this.props.item.rank}</p>
                <p>Count: {this.props.item.count}</p>
                <div style={{display:'flex'}}>
                    {this.props.item.pokemons.map(pokemon=>{
                        return <div style={{display:'flex', flexFlow:'column', alignItems: 'center'}} key={pokemon}>
                        <img style={imgStyle} src={`${CDN_PORTRAIT_URL}${PokemonFactory.createPokemonFromName(pokemon).index.replace('-','/')}/${Emotion.NORMAL}.png`}/>
                    </div> 
                    })}
                </div>
            </div>
        </div>
    }
}

export default ItemStatistic;