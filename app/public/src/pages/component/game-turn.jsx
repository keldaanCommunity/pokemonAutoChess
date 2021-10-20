import React, { Component } from 'react';

class GameTurn extends Component{

    render(){
        const style = {
            position:'absolute',
            left:'22.5%',
            top:'2%',
            color:'white',
            fontSize:'32px',
            fontFamily:'Verdana',
            WebkitTextStrokeWidth: 'thin',
            WebkitTextStrokeColor: 'black',
            fontWeight: 'bold'
        }

        return <div style={style}>Turn {this.props.turn}</div>;
    }
}

export default GameTurn;