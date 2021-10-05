import React, { Component } from 'react';

class PolicyButton extends Component{

    render(){
        const buttonStyle= {
            marginLeft:'10px',
            marginTop:'10px',
            marginRight:'10px'
        }

        return <button  type="button" style={buttonStyle} onClick={this.handlePrivacyPolicyClick.bind(this)} className="nes-btn">Privacy Policy</button>;
    }

    handlePrivacyPolicyClick(){
        window.location.href = 'https://pokemonautochess-b18fb.web.app/privacy-policy.html';
    }
}

export default PolicyButton;