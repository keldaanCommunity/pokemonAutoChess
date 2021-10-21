import React, { Component } from 'react';
import {MAP_TYPE_NAME, MAP_TYPE_NAME_DESCRIPTION} from '../../../../models/enum';
import ReactTooltip from 'react-tooltip';

class GameMapName extends Component{

    render(){
        const style = {
            position:'absolute',
            left:'0.5%',
            top:'14%',
            color:'white',
            fontSize:'32px',
            fontFamily:'Verdana',
            WebkitTextStrokeWidth: 'thin',
            WebkitTextStrokeColor: 'black',
            fontWeight: 'bold',
            width:'40px'
        };

        const pStyle = {
            fontSize:'12px',
            fontFamily:'Verdana'
        };

        const titleStyle = {
            fontSize:'18px',
            fontFamily:'Verdana'
        };
        
        if(this.props.mapName && this.props.mapName != ''){
            return <div>
                <div style={style} data-tip data-for='map-name-detail'>
                    { MAP_TYPE_NAME[this.props.mapName].eng}
                </div>
            <ReactTooltip id='map-name-detail' aria-haspopup='true' role='example'>
                <p style={titleStyle}>{MAP_TYPE_NAME[this.props.mapName].eng}</p>
                <p style={pStyle}>{MAP_TYPE_NAME_DESCRIPTION[this.props.mapName].eng}</p>
            </ReactTooltip>
            </div>
            ;
        }
        else{
            return null;
        }
    }
}

export default GameMapName;