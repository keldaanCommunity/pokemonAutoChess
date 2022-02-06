import React, { Component } from 'react';

class InlineAvatar extends Component{
    render(){
        return <div style={{
            display:'flex'
            }}>
            <img style={{width:'40px', height:'40px'}} src={"/assets/avatar/" + this.props.avatar + ".png"}/>
            <p>{this.props.name}</p>
        </div>;
    }
}

export default InlineAvatar;