import React, { Component } from 'react';
import Avatar from './avatar';

class CurrentUsers extends Component{

    render(){
        const ulStyle = {
            listStyle: 'none',
            padding: '0px',
        };

        return <div className="nes-container" style={{
            backgroundColor: 'rgba(255, 255, 255, .6)',
             margin:'10px',
             flexBasis:'10%',
             height:'90vh'
             }}>
            <ul style={ulStyle}>{Array.from(this.props.users).map(this.createUser.bind(this))}</ul>
            
        </div>;
    }

    createUser(keyValue){
        const k = keyValue[0];
        const v = keyValue[1];
        return <li key={k}><Avatar avatar={v.avatar} name={v.name} elo={v.elo}/></li>;
    }
}

export default CurrentUsers;