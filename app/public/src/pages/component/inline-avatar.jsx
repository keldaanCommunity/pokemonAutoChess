import React, { Component } from 'react';

class InlineAvatar extends Component{
    render(){

        const elo = this.props.elo ? '(' + this.props.elo + ')': '';

        return <div style={{
            display:'flex'
            }}>
            <img src={"/assets/avatar/" + this.props.avatar + ".png"}/>
            <p>{this.props.name} {elo}</p>
        </div>;
    }
}

export default InlineAvatar;