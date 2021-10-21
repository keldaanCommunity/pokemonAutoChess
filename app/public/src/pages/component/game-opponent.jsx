import React, { Component } from 'react';

class GameOpponent extends Component{

    render(){
        const style = {
            position:'absolute',
            left:'61%',
            top:'2%',
            color:'white',
            fontSize:'32px',
            fontFamily:'Verdana',
            WebkitTextStrokeWidth: 'thin',
            WebkitTextStrokeColor: 'black',
            fontWeight: 'bold'
        }

        return <div style={style}>{this.props.opponent}</div>;
    }
}

export default GameOpponent;