import React, { Component } from 'react';
import {ITEM_NAME, ITEM_DESCRIPTION} from '../../../../models/enum';

class GameItem extends Component{

    render(){
        const style={
            backgroundColor:'rgba(255,255,255,0.7)',
            width:'30%',
            display:'flex',
            flexFlow:'column',
            alignItems:'center',
            justifyContent:'space-around',
            textAlign:'center'
        };
        return <div className='nes-container' style={style}>
            <img style={{width:'96px',height:'96px',imageRendering:'pixelated'}} src={"assets/items/" + this.props.item + ".png"}></img>
            <h3>{ITEM_NAME[this.props.item]}</h3>
            <p>{ITEM_DESCRIPTION[this.props.item]}</p>
            <button onClick={()=>{this.props.itemClick(this.props.item)}} type="button" className="nes-btn is-primary">Pick</button>
        </div>;
    }
}

export default GameItem;