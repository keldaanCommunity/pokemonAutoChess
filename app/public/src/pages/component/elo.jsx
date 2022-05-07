import React, { Component } from 'react';
import { EloRankThreshold, EloRank } from '../../../../types/Config';

const style = {
    display:'flex',
    alignItems:'center',
    width:'auto'
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
            <div style={{marginLeft:'10px'}}>
                <p style={{margin:'0px'}}>{this.props.elo}</p>
            </div>
        </div>;
    }

    getRank(){
        let rank = EloRank.BRONZE;
        Object.keys(EloRankThreshold).forEach(e =>{
            if(this.props.elo > EloRankThreshold[e]){
                rank = e;
            }
        });
        return rank;
    }
}

export default Elo;