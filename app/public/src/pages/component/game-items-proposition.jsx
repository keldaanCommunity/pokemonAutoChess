import React, { Component } from 'react';
import GameItem from './game-item';

class GameItemsProposition extends Component{

    render(){
        const style = {
            position:'absolute',
            top:'30%',
            left:'15.5%',
            width:'60%',
            display:'flex',
            justifyContent:'space-between',
            padding:'10px'
        }

        if(this.props.proposition.length >0){
            return <div style={style}>
                {this.props.proposition.map((e,i)=>{
                    return <GameItem key={i} item={e} itemClick={this.props.itemClick}/>
                })}
        </div>;
        }
        else{
            return null;
        }


    }
}

export default GameItemsProposition;