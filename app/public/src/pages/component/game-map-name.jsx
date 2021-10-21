import React, { Component } from 'react';
import { MAP_TYPE_NAME } from '../../../../models/enum';

class GameMapName extends Component{

    render(){
        const style = {
            position:'absolute',
            left:'0%',
            top:'31%',
            color:'white',
            fontSize:'32px',
            fontFamily:'Verdana',
            WebkitTextStrokeWidth: 'thin',
            WebkitTextStrokeColor: 'black',
            fontWeight: 'bold'
        }
        
        if(this.props.mapName && this.props.mapName != ''){
            return <div style={style}>{ MAP_TYPE_NAME[this.props.mapName].eng}</div>;
        }
        else{
            return null;
        }
    }
}

export default GameMapName;