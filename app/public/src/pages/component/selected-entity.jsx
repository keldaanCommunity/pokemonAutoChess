import React, { Component } from 'react';
import { ITEMS, PKM, RARITY_COLOR, ITEM_DESCRIPTION } from '../../../../models/enum';
import PokemonFactory from '../../../../models/pokemon-factory';

class SelectedEntity extends Component {
  render() {
        const entityStyle = {
            display: 'flex',
            position:'absolute',
            right:'0px',
            top:'8.5%',
            margin:'10px',
            marginTop:'0px',
            backgroundColor:'rgba(255,255,255,0.7)',
            flexFlow:'column',
            width:'20%'
        };

        const imgStyle={
            height:'80px',
            width:'80px',
            imageRendering:'pixelated'
        }

        if(Object.keys(ITEMS).includes(this.props.entity)){
            return <div className='nes-container' style={entityStyle}>
                <div style={{display:'flex'}}>
                    <img style={imgStyle} src={'assets/items/' + this.props.entity + '.png'}/>
                    <h3>{this.props.entity}</h3>
                </div>
                <p>{ITEM_DESCRIPTION[this.props.entity].eng}</p>
        </div>
        }
        else if(Object.values(PKM).includes(this.props.entity)){
            let pokemon = PokemonFactory.createPokemonFromName(this.props.entity);
            return <div className='nes-container' style={entityStyle}>
                <div style={{display:'flex'}}>
                    <img style={imgStyle} src={'assets/avatar/' + pokemon.name + '.png'}/>
                    <h3>{pokemon.name}</h3>
                </div>
                <p style={{color:RARITY_COLOR[pokemon.rarity]}}>rarity:{pokemon.rarity}</p>
                <div>
                    types:{pokemon.types.map(type=>{
                        return <img key={'img'+type} src={'assets/types/'+type+'.png'}/>
                 })}
                 </div>
                <p>Health: {pokemon.hp}</p>
                <p>Attack: {pokemon.atk}</p>
                <p>Defense: {pokemon.def}</p>
                <p>Special Defense: {pokemon.speDef}</p>
                <p>Range: {pokemon.range}</p>
                <p>Mana: {pokemon.maxMana}</p>
            </div>;
        }
        else{
            return null;
        }
  }
}
export default SelectedEntity;
