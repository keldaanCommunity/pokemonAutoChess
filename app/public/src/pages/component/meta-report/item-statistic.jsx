import React, { Component } from 'react';
import {ITEM_NAME, CDN_URL} from '../../../../../models/enum';

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
                <p>{ITEM_NAME[this.props.item.name]}</p>
                <p>Average Place: {this.props.item.rank}</p>
                <p>Count: {this.props.item.count}</p>
                <div style={{display:'flex'}}>
                    {this.props.item.pokemons.map(pokemon=>{
                        return <div style={{display:'flex', flexFlow:'column', alignItems: 'center'}} key={pokemon}>
                        <img style={imgStyle} src={CDN_URL + pokemon + '.png'}/>
                    </div> 
                    })}
                </div>
            </div>
        </div>
    }
}

export default ItemStatistic;