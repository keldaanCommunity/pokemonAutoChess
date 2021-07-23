import React, { Component } from 'react';

class Avatar extends Component{
    render(){

        const elo = this.props.elo ? '(' + this.props.elo + ')': '';

        return <div style={{
            textAlign:'center',
            width:'100px'
            }}>
            <img src={"assets/avatar/" + this.props.avatar + ".png"}/>
            <p>{this.props.name} {elo}</p>
        </div>;
    }
}

export default Avatar;