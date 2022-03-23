import React, { Component } from 'react';

class GameLeave extends Component{

    render(){
        return <button type="button" className="nes-btn is-error" onClick={this.props.click}>X</button>;
    }
}

export default GameLeave;