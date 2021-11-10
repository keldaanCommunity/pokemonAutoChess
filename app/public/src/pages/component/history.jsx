import React, { Component } from 'react';
import Record from './record';

class History extends Component{

    constructor(){
        super();
        this.ulStyle = {
            listStyle: 'none',
            padding: '0px',
            display:'flex',
            flexFlow:'column'
        };
    }
    render(){
        if(this.props.history){
            return <ul style={this.ulStyle}>
                <li key='index-history-title'>
                    <div style={{display: 'flex', justifyContent:'space-around'}}>
                        <p>Rank</p>
                        <p>Team</p>
                        <p>Date</p>
                        <p>Elo</p>
                    </div>
                </li>
            {this.props.history.map(this.createGameRecord.bind(this))}
        </ul>
        }
        return null;
    }

    createGameRecord(r){
        return <li key={r.time}>
            <Record record={r}/>
        </li>
    }
}

export default History;