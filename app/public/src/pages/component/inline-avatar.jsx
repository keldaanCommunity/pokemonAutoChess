import React, { Component } from 'react';

class InlineAvatar extends Component{
    render(){
        return <div style={{
            display:'flex'
            }}>
            <img src={"/assets/avatar/" + this.props.avatar + ".png"}/>
            <p>{this.props.name}</p>
        </div>;
    }
}

export default InlineAvatar;