import React, { Component } from 'react';
import WikiButton from './wiki-button';
import WikiContent from './wiki-content';

class Wiki extends Component{

    render(){
        return <div>
            <WikiButton toggleWiki={this.props.toggleWiki} content='Lobby'/>
            <div className="nes-container" style={{backgroundColor:'white',opacity:0.9,margin:'10px'}}>
                <WikiContent/>
            </div>
        </div>
    }
}

export default Wiki;