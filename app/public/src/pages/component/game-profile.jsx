import React, { Component } from 'react';

class GameProfile extends Component{

    render(){
        const style = {
            position:'absolute',
            left:'0.5%',
            top:'2%',
            color:'white',
            fontSize:'32px',
            fontFamily:'Verdana',
            WebkitTextStrokeWidth: 'thin',
            WebkitTextStrokeColor: 'black',
            fontWeight: 'bold'
        }

        return <div style={style}>
            <div>{this.props.name.slice(0,8)}</div>
            <div>{this.props.money} <img style={{width:'25px', marginBottom:'3px'}} src="/assets/ui/money.png"/></div>
        </div>;
    }
}

export default GameProfile;