import React, { Component } from 'react';
import {TYPE} from '../../../../models/enum';
import GameSynergy from './game-synergy';

class GameSynergies extends Component{

    render(){
        const style = {
            position: 'absolute',
            left: '0.5%',
            display: 'flex',
            justifyContent:'space-between',
            width: '12%',
            top:'8.5%',
            flexFlow: 'column',
            maxHeight:'75%'
        }

        return <div style={style}>
            {Object.keys(TYPE).map(type=>{
                if(this.props.synergies[type] > 0){
                    return <GameSynergy key={type} type={type} value={this.props.synergies[type]}/>;
                }
                else{
                    return null;
                }
            })}
        </div>
    }
}

export default GameSynergies;