import React, { Component } from 'react';

class GameLevel extends Component{

    render(){
        const style = {
            position:'absolute',
            left:'6%',
            bottom:'7%',
            width:'12%'
        }

        return <button className="nes-btn is-warning" onClick={this.props.level} style={style}>
            <div>Buy XP 4<img style={{width:'20px', marginBottom:'5px'}} src="/assets/ui/money.png"/></div>
        </button>;
    }
}

export default GameLevel;