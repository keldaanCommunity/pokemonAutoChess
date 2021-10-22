import React, { Component } from 'react';
import PokemonFactory from '../../../../models/pokemon-factory';
import { COST } from '../../../../models/enum';

const COLOR_TYPE = Object.freeze({
    COMMON: "rgba(104, 109, 125, 0.6)",
    UNCOMMON: "rgba(71, 138, 65, 0.6)",
    RARE: "rgba(80, 98, 171, 0.6)",
    EPIC: "rgba(123, 70, 156,0.6)",
    LEGENDARY: "rgba(166, 128, 46, 0.6)",
    MYTHICAL: "rgba(255, 222, 255, 0.6)",
    SUMMON: "#rgba(153, 31, 31, 0.6)"
  });

class GamePokemonPortrait extends Component{

    render(){
        const pkm = PokemonFactory.createPokemonFromName(this.props.name);
        console.log(pkm.rarity);
        const rarityColor = COLOR_TYPE[pkm.rarity];
        return <div className="nes-container" style={{
            width:'19%',
            backgroundColor: rarityColor
        }}>
        <p style={{
            position:'absolute',
            bottom:'-10%',
            left:'1%',
            }}>{this.capitalizeFirstLetter(this.props.name)}</p>
        <img style={{
            position:'absolute',
            left:'0%',
            top:'0%',
            width:'30%',
            imageRendering: 'crisp-edges'
            }} src={'/assets/avatar/' + this.props.name + '.png'} />
        <div style={{position:'absolute', right:'5%', top:'5%'}}>
            {COST[pkm.rarity]}<img style={{width:'20px', marginBottom:'5px'}} src="/assets/ui/money.png"/>
        </div>
        <ul style={{
            listStyleType:'none',
            padding:'0px',
            position:'absolute',
            display:'flex',
            left:'35%',
            top:'30%'
            }}>
            {pkm.types.map(type=>{
                return <li key={type}><img src={'assets/types/'+ type +'.png'}/></li>;
            })}
        </ul>
      </div>;
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
}

export default GamePokemonPortrait;