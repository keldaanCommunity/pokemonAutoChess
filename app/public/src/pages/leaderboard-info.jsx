import React, { Component } from 'react';

class LeaderboardInfo extends Component{
    render(){
        return <tr>
            <td>{this.props.rank}</td>
            <td> <img src={"assets/avatar/" + this.props.avatar + ".png"} /> </td>
            <td>{this.props.name}</td>
            <td>{this.props.value}</td>
        </tr>;
    }
}

export default LeaderboardInfo;