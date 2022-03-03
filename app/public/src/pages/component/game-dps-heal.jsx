import React, { Component } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

class GameDpsHeal extends Component{

    render(){
        const imgStyle = {
            width:'40px',
            height:'40px'
        }

        const progressStyle = {
            height:'18px',
            borderImageOutset: '1.5'
        }

        const style = {
            display:'flex',
            alignItems:'center',
            marginBottom: '10px',
            width:'90%'
        }

        return  <div style={style}>
            <img style={imgStyle} src={`assets/avatar/${this.props.name}.png`}/>
            <div style={{display:'flex', flexFlow:'column', justifyContent:'space-around', marginLeft:'5px', width:'100%'}}>
                <p style={{marginBottom:'-5px', marginLeft:'3px'}}>{this.props.total}</p>
                <ProgressBar className="nes-progress is-primary" style={progressStyle}>
                    <ProgressBar style={{backgroundColor: '#92cc41'}} max={this.props.maxTotal} now={this.props.heal} key='heal' />
                    <ProgressBar style={{backgroundColor: '#8d8d8d'}} max={this.props.maxTotal} now={this.props.shield} key='shield' />
                </ProgressBar>
            </div>
        </div>
    }
}

export default GameDpsHeal;