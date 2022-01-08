import React, { Component } from 'react';
import { TYPE_TRIGGER } from '../../../../models/enum';
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
            maxHeight:'75%',
            overflowY:'scroll'
        }

        return <div style={style}>
            {Object.keys(this.props.synergies).sort((a,b)=>{
                    if(this.props.synergies[a] == this.props.synergies[b]){
                        if(this.props.synergies[a] >= TYPE_TRIGGER[a][0]){
                            return -1;
                        }
                        else{
                            return 1;
                        }
                    }
                    else{
                        return this.props.synergies[b] - this.props.synergies[a];
                    }
                }).map((type, index)=>{
                if(this.props.synergies[type] > 0){
                    return <GameSynergy key={type} type={type} isFirst={index==0} value={this.props.synergies[type]}/>;
                }
                else{
                    return null;
                }
            })}
        </div>
    }
}

export default GameSynergies;