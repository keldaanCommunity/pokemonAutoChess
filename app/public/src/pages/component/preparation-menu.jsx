import React, { Component } from 'react';
import InlineAvatar from './inline-avatar';

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
                <table>
                    <thead>
                        <tr>
                            <td>Player</td>
                            <td>Ready</td>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from(this.props.users).map(this.createUser.bind(this))}
                    </tbody>
                </table>
                <div style={{display: 'flex'}}>
                    <button style={buttonStyle} className='nes-btn is-warning' onClick={this.props.toggleReady}>Ready</button>
                    <button style={buttonStyle} className='nes-btn is-success' onClick={this.props.startGame}>Start Game</button>
                    <button style={buttonStyle} className='nes-btn is-primary' onClick={this.props.addBot}>Add Bot</button>
                    <button style={buttonStyle} className='nes-btn is-primary' onClick={this.props.removeBot}>Remove Bot</button>
                </div>
            </div>
    }

    createUser(keyValue){
        const k = keyValue[0];
        const v = keyValue[1];
        const ready = v.ready ? 'V' : 'X';
        return <tr key={k}>
            <td><InlineAvatar avatar={v.avatar} name={v.name} elo={v.elo}/></td>
            <td>{ready}</td>
        </tr>
    }
}

export default PreparationMenu;