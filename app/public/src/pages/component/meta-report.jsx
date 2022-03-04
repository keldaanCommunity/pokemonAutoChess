import React, { Component } from 'react';
import TeamComp from './team-comp';

class MetaReport extends Component{

    render(){

        const buttonStyle= {
            marginLeft:'10px',
            marginTop:'10px',
            marginRight:'10px'
        }
        console.log(this.props.meta);
        let sortedMeta = this.props.meta.sort((a,b)=>{return a.mean_rank - b.mean_rank});
        return <div>
            <button className='nes-btn is-success' style={buttonStyle} onClick={this.props.toggleMeta}>Lobby</button>
            <div className='nes-container' style={{backgroundColor:'rgba(255,255,255,0.6)', margin:'20px', height: '90vh'}}>
                <h2>Meta Team Composition</h2>
                <div style={{height:'80vh', overflowY:'scroll'}}>
                    {sortedMeta.map(team=>{
                        return <TeamComp team={team} key={team.cluster_id}/>;
                    })}
                </div>
            </div>
        </div>
    }
}

export default MetaReport;