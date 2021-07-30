import React, { Component } from 'react';
import LeaderboardInfo from './leaderboard-info';

class Leaderboard extends Component{
    render(){
        return <div>
            <table>
                <thead></thead>
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
        value={i.value}/>
    }
}

export default Leaderboard;