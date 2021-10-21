import React, { Component } from 'react';

class GameRefresh extends Component{

    render(){
        const style = {
            position:'absolute',
            left:'18%',
            bottom:'6%',
            cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`,
            width:'195px',
            height:'50px'
        }

        return <button className="nes-btn is-primary" onClick={this.props.refresh} style={style}>
            Refresh 2<img style={{width:'20px', marginBottom:'5px'}} src="/assets/ui/money.png"/>
        </button>;
    }
}

export default GameRefresh;