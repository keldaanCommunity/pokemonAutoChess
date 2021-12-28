import React, { Component } from 'react';
import {RANK} from '../../../../models/enum';

const style = {
    display:'flex',
    alignItems:'center'
}

const imgStyle={
    width:'48px',
    height:'48px',
    imageRendering:'pixelated'
};

class Elo extends Component{

    render(){
        let rank = this.getRank();
        return <div style={style}>
            <img style={imgStyle} src={'assets/ranks/'+ rank + '.png'}/>
            <p>{this.props.elo}</p>
        </div>;
    }

    getRank(){
        let rank = RANK.BRONZE.id;
        let keys = Object.keys(RANK);
        for (let i = 0; i < keys.length; i++) {
            if(this.props.elo > RANK[keys[i]].threshold){
                rank = keys[i];
                break;
            }
        }
        return rank;
    }
}

export default Elo;