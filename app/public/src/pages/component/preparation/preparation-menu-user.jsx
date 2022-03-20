import React, { Component } from 'react';
import Elo from '../elo';
import InlineAvatar from '../inline-avatar';

class PreparationMenuUser extends Component{
    

    render(){
        const buttonStyle = {
            marginLeft:'10px',
            marginRight:'10px'
        };

        const readyColor = this.props.data.ready ? "#76c442" : "#ce372b";

        const removeButton = this.props.data.isBot ? 
            <button style={buttonStyle} className='nes-btn is-error' onClick={() => this.props.removeBot(this.props.data.id)}>X</button> :
            null

        return <>
            <div className='nes-container' style={{display:'flex', backgroundColor: '#fff', padding:'10px', margin:'5px', borderColor:readyColor, justifyContent:'space-between'}}>
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