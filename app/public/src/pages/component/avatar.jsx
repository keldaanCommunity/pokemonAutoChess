import React, { Component } from 'react';
import Elo from './elo';

class Avatar extends Component{
    render(){

        const elo = this.props.elo ? <Elo elo={this.props.elo}/>: null;

        return <div style={{
            textAlign:'center',
            display:'flex',
            alignItems:'center',
            flexFlow:'column'
            }}>
            <img src={"/assets/avatar/" + this.props.avatar + ".png"}/>
            <p style={{margin:'0px'}}>{this.props.name}</p>
            {elo}
        </div>;
    }
}

export default Avatar;