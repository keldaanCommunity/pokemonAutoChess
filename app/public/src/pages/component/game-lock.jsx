import React, { Component } from 'react';

class GameLock extends Component{

    render(){
        const style = {
            position:'absolute',
            left:'14.5%',
            bottom:'6%',
            cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
        }

        return <button className= {this.props.shopLocked ? "nes-btn is-error": "nes-btn is-success"} onClick={this.props.lock} style={style}>
            <img style={{width:'25px', marginLeft:'-1px'}} src="/assets/ui/lock.png"/>
        </button>;
    }
}

export default GameLock;