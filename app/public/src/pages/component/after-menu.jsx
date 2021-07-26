import React, { Component } from 'react';
import Avatar from './avatar';
import Team from './team';

class AfterMenu extends Component{

    render(){
        return <table>
        <thead>
            <tr>
                <td>Rank</td>
                <td>Player</td>
                <td>Team</td>
            </tr>
        </thead>
        <tbody>
            {Array.from(this.props.players).map(this.createPlayer.bind(this))}
        </tbody>
        </table>
    }

    createPlayer(keyValue){
        const k = keyValue[0];
        const v = keyValue[1];
        //console.log(keyValue);
        return <tr key={k}>
                <td>{v.rank}</td>
                <td><Avatar avatar={v.avatar} name={v.name}/></td>
                <td><Team team={v.pokemons}/></td>
        </tr>
    }
}

export default AfterMenu;