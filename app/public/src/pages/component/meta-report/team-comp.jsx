import React, { Component } from 'react';
import { CDN_PORTRAIT_URL } from '../../../../../models/enum';
import PokemonFactory from '../../../../../models/pokemon-factory';
import { Emotion } from '../../../../../types';

class TeamComp extends Component{

    capitalizeFirstLetter(string) {
        if(string){
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        else{
            return null
        }
      }

    render(){
        let sortedTypes = this.props.team.types ? Object.keys(this.props.team.types).sort((a,b)=>{return this.props.team.types[b] - this.props.team.types[a]}) : [];
        let sortedPokemons = this.props.team.pokemons ? Object.keys(this.props.team.pokemons).sort((a,b)=>{return this.props.team.pokemons[b] - this.props.team.pokemons[a]}) : [];

        return <div style={{backgroundColor:'rgba(255,255,255,1)', margin:'10px'}} className='nes-container'>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div style={{display:'flex'}}>
                    {sortedTypes.map(type=>{
                        return <div style={{display:'flex', flexFlow:'column', alignItems: 'center'}} key={type}>
                            <img style={{width:'51px', height:'51px', imageRendering:'pixelated', marginRight:'4px'}} src={'assets/types/' + type.toUpperCase() + '.png'}/>
                            <p>{this.props.team.types[type]}</p>
                        </div> 
                    })}
                </div>
                <h3 style={{position:'absolute', left:'32.5%', top:'20px'}}>{this.capitalizeFirstLetter(sortedTypes[0])} {this.props.team.types[sortedTypes[0]]} / {this.capitalizeFirstLetter(sortedTypes[1])} {this.props.team.types[sortedTypes[1]]}</h3>
                <div style={{display:'flex'}}>
                    {sortedPokemons.map(pokemon=>{
                        return <div style={{display:'flex', flexFlow:'column', alignItems: 'center'}} key={pokemon}>
                        <img style={{width:'60px', height:'60px', imageRendering:'pixelated'}} src={`${CDN_PORTRAIT_URL}${PokemonFactory.createPokemonFromName(pokemon).index.replace('-','/')}/${Emotion.NORMAL}.png`}/>
                        <p>{this.props.team.pokemons[pokemon].toFixed(1)}</p>
                    </div> 
                    })}
                </div>
            </div>

            <div style={{display: 'flex', justifyContent:'space-between'}}>
                <p>Average Place: {this.props.team.mean_rank.toFixed(2)}</p>
                <p>Winrate: {this.props.team.winrate.toFixed(2)} %</p>
                <p>Popularity: {this.props.team.ratio.toFixed(2)} %</p>
                <p>Count: {this.props.team.count}</p>
            </div>
        </div>
    }
}

export default TeamComp;