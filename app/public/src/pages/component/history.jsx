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
            {this.props.history.map(this.createGameRecord.bind(this))}
        </ul>
        }
        return null;
    }

    createGameRecord(r){

        let jsdate = new Date(r.time);

        return <li key={r.time}>
            <div style={{display: 'flex', justifyContent:'space-between'}}>
                <p>{r.rank}</p>
                <ul style={{listStyle: 'none', padding: '0px', display:'flex'}}>
                    {r.pokemons.map(this.createPokemon.bind(this))}
                </ul>
                <p>{jsdate.toLocaleDateString()}</p>
                <p>{r.elo}</p>
            </div>
        </li>
    }

    createPokemon(p, index){
        return <li key={index}>
            <img src={"/assets/avatar/" + p + ".png"}/>
        </li>
    }
}

export default History;