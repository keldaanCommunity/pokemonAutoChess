import React, { Component } from 'react';
import {TYPE_DETAILS, TYPE_TRADUCTION, PRECOMPUTED_TYPE_POKEMONS, RARITY_COLOR} from '../../../../../models/enum';
import PokemonFactory from '../../../../../models/pokemon-factory';

class GameSynergyDetail extends Component{

    render(){
        return <div>
             <div style={{display:'flex'}}>
                <img style={{width:'40px', height:'40px', marginRight:'10%'}} src={'assets/types/' + this.props.type + '.png'}/>
                <h3>{TYPE_TRADUCTION[this.props.type].eng}</h3>
            </div>
             
             {TYPE_DETAILS[this.props.type].description.eng.map((d,i)=>{
                 return <div key={i} style={{
                     color: d.trigger <= this.props.value ? '#000000' : '#808080'
                 }}>
                        <h5>{d.title}</h5>
                        <p>{d.text}</p>
                     </div>
             })}
            <div style={{display:'flex'}}>
            {PRECOMPUTED_TYPE_POKEMONS[this.props.type].pokemons.map(p=>{
                const s = {border : '3px solid ' + RARITY_COLOR[PokemonFactory.getPokemonRarityFromName(p)]};
                return <img key={p} style={s} src={'assets/avatar/' + p + '.png'}/>    
            })}
            </div>
            <div style={{display:'flex', marginTop:'10px'}}>
            {PRECOMPUTED_TYPE_POKEMONS[this.props.type].mythicalPokemons.map(p=>{
                const s = {border : '3px solid ' + RARITY_COLOR[PokemonFactory.getPokemonRarityFromName(p)]};
                return <img key={p} style={s} src={'assets/avatar/' + p + '.png'}/>    
            })}
            </div>
        </div>
    }
}

export default GameSynergyDetail;