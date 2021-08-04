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
        const cursorStyle = {
            cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
        }

        const k = keyValue[0];
        const v = keyValue[1];
        return <li key={k} onClick={()=>this.props.displayInfo(v.name)} style={cursorStyle}><Avatar avatar={v.avatar} name={v.name} elo={v.elo}/></li>;
    }
}

export default CurrentUsers;