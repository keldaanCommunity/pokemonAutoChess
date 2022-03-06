import React, { Component } from 'react';
import TeamComp from './team-comp';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Discover from './discover';

class MetaReport extends Component{

    render(){

        const buttonStyle= {
            marginLeft:'10px',
            marginTop:'10px',
            marginRight:'10px'
        }
        // console.log(this.props.meta);
        let sortedMeta = this.props.meta.sort((a,b)=>{return a.mean_rank - b.mean_rank});
        return <div>
            <button className='nes-btn is-success' style={buttonStyle} onClick={this.props.toggleMeta}>Lobby</button>
            <div className='nes-container' style={{backgroundColor:'rgba(255,255,255,0.6)', margin:'10px', height: '90vh'}}>
                <Tabs>
                    <TabList>
                        <Tab key='team-comps'><p>Meta Report</p></Tab>
                        <Tab key='discover'><p>Discover</p></Tab>
                    </TabList>

                    <TabPanel key='team-comps-panel'>
                        <div style={{height:'75vh', overflowY:'scroll'}}>
                            {sortedMeta.map(team=>{
                                return <TeamComp team={team} key={team.cluster_id}/>;
                            })}
                    </div>
                    </TabPanel>
                    <TabPanel key='discover-panel'>
                        <Discover meta={sortedMeta}/>
                    </TabPanel>
                </Tabs>
                

            </div>
        </div>
    }
}

export default MetaReport;