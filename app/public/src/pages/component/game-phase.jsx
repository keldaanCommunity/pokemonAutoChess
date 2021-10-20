import React, { Component } from 'react';

class GamePhase extends Component{

    render(){
        const style = {
            position:'absolute',
            left:'41.5%',
            top:'2%',
            color:'white',
            fontSize:'32px',
            fontFamily:'Verdana',
            WebkitTextStrokeWidth: 'thin',
            WebkitTextStrokeColor: 'black',
            fontWeight: 'bold'
        }

        return <div style={style}>{this.props.phase}</div>;
    }
}

export default GamePhase;