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
            overflowY:'scroll',
            padding:'0px',
            backgroundColor:'rgba(255,255,255,0.6)' 
        }
        if(this.props.synergies && this.props.synergies.length != 0){
            return <div style={style} className='nes-container hidden-scrollable'>
                <h5 style={{padding:'10px', textAlign: 'center'}}>Synergies</h5>
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
        else{
            return null;
        }
    }
}

export default GameSynergies;