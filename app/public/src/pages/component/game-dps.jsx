import React, { Component } from 'react';

class GameDps extends Component{

    render(){
        const imgStyle = {
            width:'40px',
            height:'40px'
        }

        const progressStyle = {
            height:'20px'
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
                <p style={{marginBottom:'0px'}}>{this.props.damage}</p>
                <progress className={this.props.cssClass} style={progressStyle} value={this.props.damage} max={this.props.maxDamage}></progress>
            </div>
        </div>
    }
}

export default GameDps;