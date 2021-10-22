import React, { Component } from 'react';

class GameRefresh extends Component{

    render(){
        const style = {
            position:'absolute',
            left:'6%',
            top: '5%',
            width:'15%'
        }

        return <button className="nes-btn is-primary" onClick={this.props.refresh} style={style}>
            Refresh 2<img style={{width:'20px', marginBottom:'5px'}} src="/assets/ui/money.png"/>
        </button>;
    }
}

export default GameRefresh;