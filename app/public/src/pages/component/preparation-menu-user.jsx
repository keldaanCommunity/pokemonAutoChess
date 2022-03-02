import React, { Component } from 'react';
import Elo from './elo';
import InlineAvatar from './inline-avatar';

class PreparationMenuUser extends Component{
    

    render(){
        const buttonStyle = {
            marginLeft:'10px',
            marginRight:'10px'
        };

        const readyColor = this.props.data.ready ? "rgba(71, 138, 65, 0.4)" : "rgba(104, 109, 125, 0.4)";

        const removeButton = this.props.data.isBot ? 
            <button style={buttonStyle} className='nes-btn is-error' onClick={() => this.props.removeBot(this.props.data.id)}>Remove</button> :
            null

        return <>
            <div className='nes-container' style={{display:'flex', padding:'10px', margin:'5px', backgroundColor:readyColor, justifyContent:'space-between'}}>
                <div style={{display:'flex'}}>
                    <div style={{width:'140px'}}>
                        <Elo elo={this.props.data.elo} style={{width:'140px'}}/>
                    </div>
                    <InlineAvatar avatar={this.props.data.avatar} name={this.props.data.name}/>
                </div>
                {removeButton}
            </div>
        </>
        
    }

}

export default PreparationMenuUser;