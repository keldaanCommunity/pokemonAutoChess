import React, { Component } from 'react';

class InlineAvatar extends Component{
    render(){
        return <div style={{
            display:'flex', alignItems:'center'
            }}>
            <img style={{width:'40px', height:'40px'}} src={"/assets/avatar/" + this.props.avatar + ".png"}/>
            <p style={{margin:'0px', marginLeft:'10px', maxWidth:'350px', overflow:'hidden', whiteSpace:'nowrap'}}>{this.props.name}</p>
        </div>;
    }
}

export default InlineAvatar;