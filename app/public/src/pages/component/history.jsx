import React, { Component } from 'react';

class History extends Component{

    constructor(){
        super();
        this.ulStyle = {
            listStyle: 'none',
            padding: '0px',
            display:'flex',
            flexFlow:'column'
        };
    }
    render(){
        if(this.props.history){
            return <ul style={this.ulStyle}>
                <li key='index-history-title'>
                    <div style={{display: 'flex', justifyContent:'space-around'}}>
                        <p>Rank</p>
                        <p>Team</p>
                        <p>Date</p>
                        <p>Elo</p>
                    </div>
                </li>
            {this.props.history.map(this.createGameRecord.bind(this))}
        </ul>
        }
        return null;
    }

    createGameRecord(r){

        return <li key={r.time}>
            <div style={{display: 'flex', justifyContent:'space-around'}}>
                <p>{r.rank}</p>
                <ul style={{listStyle: 'none', padding: '0px', display:'flex'}}>
                    {r.pokemons.map(this.createPokemon.bind(this))}
                </ul>
                <p>{this.formatDate(r.time)}</p>
                <p style={{marginLeft: '10px'}}>{r.elo}</p>
            </div>
        </li>
    }

    createPokemon(p, index){
        return <li key={index}>
            <img src={"/assets/avatar/" + p + ".png"}/>
        </li>
    }

    
    formatDate(n) {
        let date = new Date(n);
        return  this.pad( date.getUTCMonth() + 1 ) +
            '/' + this.pad( date.getUTCDate() ) +
            ' ' + this.pad( date.getUTCHours() ) +
            ':' + this.pad( date.getUTCMinutes() )
    };

    pad(number) {
        if ( number < 10 ) {
            return '0' + number;
            }
        return number;
    }
    
}

export default History;