import React, { Component } from 'react';
import Elo from '../elo';
import InlineAvatar from '../inline-avatar';
import ReactTooltip from 'react-tooltip';
import PreparationMenuUser from './preparation-menu-user';

class PreparationMenu extends Component{
    constructor(props){
        super(props);

        this.state = {
            botDifficulty: 'normal'
        };
    }

    render(){
        const buttonStyle = {
            marginLeft:'10px',
            marginRight:'10px'
        };

        const userList = Array.from(this.props.users).map((keyPair) => {
            return <PreparationMenuUser 
                key={keyPair[0]} 
                removeBot={this.props.removeBot}
                data={keyPair[1]}
            />
        })

        return <div className="nes-container with-title is-centered" style={{
            backgroundColor: 'rgba(255, 255, 255, .6)',
             margin:'10px',
             display: 'flex',
             flexFlow: 'column',
             justifyContent: 'space-between',
             flexBasis:'50%'
             }}>
                <p className="title">Room id: {this.props.id}</p>
                <div>
                    {userList}
                </div>


                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex'}}>
                        <button data-tip data-for={'difficulty-select'} style={buttonStyle} className='nes-btn is-primary' onClick={() => this.props.addBot(this.state.botDifficulty)}>
                            <ReactTooltip id={'difficulty-select'} 
                                className='customeTheme' 
                                textColor='#000000' 
                                backgroundColor='rgba(255,255,255,1) !important' 
                                effect='solid'
                                place='top'>
                                <p>Easy: &lt;800</p>
                                <p>Normal: 800-1100</p>
                                <p>Hard: &gt;1100</p>
                            </ReactTooltip>
                            Add Bot
                        </button>

                        <div className="nes-select" style={{width: 'auto'}} onChange={this.handleDifficultyChange.bind(this)}>
                            
                            <select defaultValue={this.state.botDifficulty}>
                                <option value="easy">Easy</option>
                                <option value="normal">Normal</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        
                    </div>
                    <div>
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
                    </div>

                    
                </div>
            </div>
    }

    handleDifficultyChange(e){
        if(e.target.value.length !=0){
            this.setState({
                botDifficulty: e.target.value
            });
        }
    }

}

export default PreparationMenu;