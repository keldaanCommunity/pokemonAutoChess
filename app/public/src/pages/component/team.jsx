import React, { Component } from 'react';

class Team extends Component{

    render(){
        const ulStyle = {
            listStyle: 'none',
            padding: '0px',
            display: 'flex'
        };

        return <ul style={ulStyle}>
            {this.props.team.map(this.createPokemon.bind(this))}
        </ul>
    }

    createPokemon(v, index){
        return <li key={index}>
            <img src={"/assets/avatar/" + v + ".png"}/>
        </li>
    }
}

export default Team;