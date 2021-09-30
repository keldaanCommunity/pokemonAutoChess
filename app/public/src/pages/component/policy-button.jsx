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
        window.location.href = 'https://www.termsfeed.com/live/ddf4f373-8cdf-4efd-a547-c2a8e0a22a9a';
    }
}

export default PolicyButton;