import React, { Component } from 'react';

class WikiButton extends Component{

    render(){
        const buttonStyle= {
            marginLeft:'10px',
            marginTop:'10px',
            marginRight:'10px'
        }

        return <button type="button" style={buttonStyle} className="nes-btn is-success" onClick={this.props.toggleWiki}>{this.props.content}</button>;
    }
}

export default WikiButton;