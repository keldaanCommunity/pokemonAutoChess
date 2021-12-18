import React, { Component } from 'react';

class DonateButton extends Component{

    render(){
        const buttonStyle= {
            marginLeft:'10px',
            marginTop:'10px',
            marginRight:'10px'
        }

        return <button type="button" style={buttonStyle} className="nes-btn is-warning" onClick={this.handleTipeeClick.bind(this)}>Donate</button>;
    }

    handleTipeeClick(){
        window.location.href = 'https://en.tipeee.com/pokemon-auto-chess';
    }
}

export default DonateButton;