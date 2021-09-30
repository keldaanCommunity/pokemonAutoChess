import React, { Component } from 'react';

class CreditsButton extends Component{

    render(){
        const buttonStyle= {
            marginLeft:'10px',
            marginTop:'10px',
            marginRight:'10px'
        }

        return <button type="button" style={buttonStyle} className="nes-btn" onClick={this.handleCreditsClick.bind(this)}>Credits</button>;
    }

    handleCreditsClick(){
        window.location.href = 'https://pokemonautochess-b18fb.web.app/';
    }
}

export default CreditsButton;