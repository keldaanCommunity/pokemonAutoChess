import React, { Component } from 'react';
import LeaderboardInfo from './leaderboard-info';

class Leaderboard extends Component{
    render(){
        return <div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>Rank</p>
                <p>Name</p>
                <p>Elo</p>
            </div>
            <table>
                <tbody>
                    {this.props.infos.map(this.createItem.bind(this))}
                </tbody>
            </table>
        </div>;
    }

    createItem(i){
        return <LeaderboardInfo 
        key={i.rank}
        name={i.name} 
        avatar ={i.avatar} 
        rank={i.rank} 
        value={i.value}
        displayInfo={this.props.displayInfo}/>
    }
}

export default Leaderboard;