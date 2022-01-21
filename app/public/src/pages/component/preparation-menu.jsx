import React, { Component } from 'react';
import Elo from './elo';
import InlineAvatar from './inline-avatar';
import ReactTooltip from 'react-tooltip';

class PreparationMenu extends Component{
    render(){
        const buttonStyle = {
            marginLeft:'10px',
            marginRight:'10px'
        };

        return <div className="nes-container with-title is-centered" style={{
            backgroundColor: 'rgba(255, 255, 255, .6)',
             margin:'10px',
             display: 'flex',
             flexFlow: 'column',
             justifyContent: 'space-between'
             }}>
                <p className="title">Room id: {this.props.id}</p>
                <div>
                    {Array.from(this.props.users).map(this.createUser.bind(this))}
                </div>

                <div style={{display: 'flex'}}>
                    <button style={buttonStyle} className='nes-btn is-warning' onClick={this.props.toggleReady}>Ready</button>
                    <button 
                        style={buttonStyle} 
                        className={this.props.ownerId == this.props.uid ? 'nes-btn is-success':'nes-btn is-disabled'} 
                        onClick={this.props.ownerId == this.props.uid ? this.props.startGame: null}
                        data-tip
                        data-for={'start-game'}
                        >
                        Start Game
                        <ReactTooltip id={'start-game'} 
                            className='customeTheme' 
                            textColor='#000000' 
                            backgroundColor='rgba(255,255,255,1) !important' 
                            effect='solid'
                            place='top'>
                            <p>Owner: ({this.props.ownerName})</p>
                        </ReactTooltip>
                    </button>
                    <button style={buttonStyle} className='nes-btn is-primary' onClick={this.props.addBot}>Add Bot</button>
                    <button style={buttonStyle} className='nes-btn is-primary' onClick={this.props.removeBot}>Remove Bot</button>
                </div>
            </div>
    }

    createUser(keyValue){
        const k = keyValue[0];
        const v = keyValue[1];
        const ready = v.ready ? 'V' : 'X';
        return <div key={k} style={{display:'flex', justifyContent:'space-between'}}>
            <div style={{display:'flex'}}>
                <Elo elo={v.elo}/>
                <InlineAvatar avatar={v.avatar} name={v.name}/>
            </div>
            <p>{ready}</p>
        </div>
    }
}

export default PreparationMenu;