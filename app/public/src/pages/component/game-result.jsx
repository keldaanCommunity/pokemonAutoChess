import React, { Component } from 'react';

class GameResult extends Component{

    render(){
        const style = {
            position:'absolute',
            left:'50.5%',
            top:'2%',
            color:'white',
            fontSize:'32px',
            fontFamily:'Verdana',
            WebkitTextStrokeWidth: 'thin',
            WebkitTextStrokeColor: 'black',
            fontWeight: 'bold'
        }

        return <div style={style}>{this.props.result}</div>;
    }
}

export default GameResult;