import React, { Component } from 'react';
import {TYPE_TRADUCTION} from '../../../../models/enum';

class GameSynergy extends Component{

    render(){
        return <div style={{display: 'flex'}}>
            <img src={'assets/types/' + this.props.type + '.png'}/>
            <p>{this.props.value}</p>
            <p>{TYPE_TRADUCTION[this.props.type]['eng']}</p>
        </div>
    }
}

export default GameSynergy;