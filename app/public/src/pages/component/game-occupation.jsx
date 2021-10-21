import React, { Component } from 'react';

class GameOccupation extends Component{

    render(){
        const style = {
            position:'absolute',
            left:'14.5%',
            top:'2%',
            color:'white',
            fontSize:'32px',
            fontFamily:'Verdana',
            WebkitTextStrokeWidth: 'thin',
            WebkitTextStrokeColor: 'black',
            fontWeight: 'bold'
        }

        return <div style={style}>{this.props.boardSize}/{this.props.maxBoardSize}</div>;
    }
}

export default GameOccupation;