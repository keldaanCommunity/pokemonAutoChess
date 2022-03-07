import React, { Component} from 'react';
import TeamComp from './team-comp';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Discover from './discover';

class MetaReport extends Component{

    constructor(props){
        super(props);
        this.state = {
            rankingBy: 'count'
        };
    }

    setRanking(event){
        this.setState({rankingBy: event.target.value});
    }

    render(){

        const buttonStyle= {
            marginLeft:'10px',
            marginTop:'10px',
            marginRight:'10px'
        }
        // console.log(this.props.meta);
        let sortedMeta = this.props.meta;
        if(this.state.rankingBy == 'count' || this.state.rankingBy == 'winrate') {
            sortedMeta = this.props.meta.sort((a,b)=>{return b[this.state.rankingBy] - a[this.state.rankingBy]});
        }
        else {
            sortedMeta = this.props.meta.sort((a,b)=>{return a[this.state.rankingBy] - b[this.state.rankingBy]});
        }
        return <div>
            <button className='nes-btn is-success' style={buttonStyle} onClick={this.props.toggleMeta}>Lobby</button>
            <div className='nes-container' style={{backgroundColor:'rgba(255,255,255,0.6)', margin:'10px', height: '90vh'}}>
                <Tabs>
                    <TabList>
                        <Tab key='team-comps'><p>Meta Report</p></Tab>
                        <Tab key='discover'><p>Discover</p></Tab>
                    </TabList>

                    <TabPanel key='team-comps-panel'>
                        <div style={{display:'flex', width:'20%',alignItems:'center'}} className='nes-select'>
                            <p style={{marginRight:'20px'}}>Rank</p>
                            <select value={this.state.rankingBy} onChange={this.setRanking.bind(this)}>
                                <option value="count">by popularity</option>
                                <option value="mean_rank">by average place</option>
                                <option value="winrate">by winrate</option>
                            </select>
                        </div>
                        <div style={{height:'70vh', overflowY:'scroll'}}>
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