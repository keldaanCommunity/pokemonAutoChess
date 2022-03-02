import React, { Component } from 'react';
import Elo from './elo';

const clickStyle = {
    cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
}

class LeaderboardInfo extends Component{
    render(){
        return <tr onClick={()=>{this.props.displayInfo ? this.props.displayInfo(this.props.name): null}}
        style= {this.props.displayInfo ? clickStyle: null}>
            <td>
                {this.props.rank}
            </td>
            <td>
                <img src={"assets/avatar/" + this.props.avatar + ".png"}/>    
            </td>
            <td style={{overflow:'hidden', whiteSpace:'nowrap', maxWidth:'300px'}}>
                {this.props.name}
            </td>
            <td> 
                <Elo elo={this.props.value}/>
            </td>
        </tr>;
    }
}

export default LeaderboardInfo;