import React, { Component } from 'react';

class GameTime extends Component{

    render(){
        const style = {
            position:'absolute',
            left:'33%',
            top:'2%',
            color:'white',
            fontSize:'32px',
            fontFamily:'Verdana',
            WebkitTextStrokeWidth: 'thin',
            WebkitTextStrokeColor: 'black',
            fontWeight: 'bold'
        }

        return <div style={style}>{this.props.time} s</div>;
    }
}

export default GameTime;