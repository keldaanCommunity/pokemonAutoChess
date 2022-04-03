import React, { Component } from 'react';

class DiscordButton extends Component{

    render(){
        const buttonStyle= {
            marginLeft:'10px',
            marginTop:'10px',
            marginRight:'10px'
        }

        return <button type="button" style={buttonStyle} className="nes-btn is-primary" onClick={this.handleDiscordClick.bind(this)}>Join Discord</button>;
    }

    handleDiscordClick(){
        window.location.href = 'https://discord.gg/6JMS7tr'
    }
}

export default DiscordButton;