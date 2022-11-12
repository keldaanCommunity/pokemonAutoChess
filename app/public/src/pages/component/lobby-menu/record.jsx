import React, { Component } from 'react'
import Elo from '../elo'
import { getAvatarSrc } from '../../../utils'

class Record extends Component{

    constructor(){
        super()
        this.ulStyle = {
            listStyle: 'none',
            padding: '0px',
            display:'flex',
            flexFlow:'column'
        }
    }
    render(){
        return <div style={{marginBottom:'10px',
        padding:'10px'
        }} className='nes-container'>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h3>Top {this.props.record.rank}</h3>
                <p>{this.formatDate(this.props.record.time)}</p>
                <div style={{display:'flex',alignItems:'center'}}><Elo elo={this.props.record.elo}/></div>
            </div>
            <div style={{display:'flex', overflowX:'scroll'}}>
                {this.props.record.pokemons.map(this.createPokemon.bind(this))}
            </div>
    </div>
    }

    createPokemon(p, index){
        return <div key={index}>
            <img style={{width:'60px', imageRendering:'pixelated'}} src={getAvatarSrc(p.avatar)}/>
            <div style={{display:'flex'}}>
                {p.items.map((item, i)=> {return <img key={i} style={{width:'20px', height:'20px', imageRendering:'pixelated'}} src={'/assets/item/' + item + '.png'}/>})}
            </div>
        </div>
    }

    
    formatDate(n) {
        let date = new Date(n)
        return  this.pad( date.getUTCMonth() + 1 ) +
            '/' + this.pad( date.getUTCDate() ) +
            ' ' + this.pad( date.getUTCHours() ) +
            ':' + this.pad( date.getUTCMinutes() )
    }

    pad(number) {
        if ( number < 10 ) {
            return '0' + number
            }
        return number
    }
    
}

export default Record