import React, { Component } from 'react';

class GameLock extends Component{

    render(){
        const style = {
            position:'absolute',
            top:'5%',
            left:'1%'
        }

        return <button className= {this.props.shopLocked ? "nes-btn is-error": "nes-btn is-success"} onClick={this.props.lock} style={style}>
            <img style={{width:'25px', marginLeft:'-1px'}} src="/assets/ui/lock.png"/>
        </button>;
    }
}

export default GameLock;