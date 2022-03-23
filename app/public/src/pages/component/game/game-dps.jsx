import React, { Component } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

class GameDps extends Component{

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
                <p style={{marginBottom:'-5px', marginLeft:'3px'}}>{this.props.damage}</p>
                <ProgressBar className="nes-progress is-primary" style={progressStyle}>
                    <ProgressBar style={{backgroundColor: '#e76e55'}} max={this.props.maxDamage} now={this.props.physicalDamage} key='physical' />
                    <ProgressBar style={{backgroundColor: '#209cee'}} max={this.props.maxDamage} now={this.props.specialDamage} key='special' />
                    <ProgressBar style={{backgroundColor: '#f7d51d'}} max={this.props.maxDamage} now={this.props.trueDamage} key='true' />
                </ProgressBar>
            </div>
        </div>
    }
}

export default GameDps;