import React, { Component } from 'react';

class BotLeaderboard extends Component{
    render(){
        let scenarios = Array.from( Object.values(this.props.botData) );
        scenarios.sort((a,b)=>{return b.elo - a.elo});

        return <div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>Name</p>
                <p>Elo</p>
            </div>
            <table>
                <tbody>
                    {scenarios.map(this.createItem.bind(this))}
                </tbody>
            </table>
        </div>;
    }

    createItem(bot){
        return <tr key={bot.avatar}>
            <td> <img src={"assets/avatar/" + bot.avatar + ".png"} /> </td>
            <td>{bot.avatar} (@{bot.author})</td>
            <td>{bot.elo}</td>
        </tr>;
    }
}

export default BotLeaderboard;