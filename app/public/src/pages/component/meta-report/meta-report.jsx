import React, { Component} from 'react';
import TeamComp from './team-comp';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Discover from './discover';
import ItemStatistic from './item-statistic';

class MetaReport extends Component{

    constructor(props){
        super(props);
        this.state = {
            rankingBy: 'count',
            itemRankingBy: 'count'
        };
    }

    setRanking(event){
        this.setState({rankingBy: event.target.value});
    }

    setItemRanking(event){
        this.setState({itemRankingBy: event.target.value});
    }

    render(){

        const buttonStyle= {
            marginLeft:'10px',
            marginTop:'10px',
            marginRight:'10px'
        }
        
        let meta = this.props.meta.slice();
        let metaItems = this.props.metaItems.slice();
        let sortedMeta = [];
        let sortedMetaItems = [];
        if(this.state.rankingBy == 'count' || this.state.rankingBy == 'winrate') {
            sortedMeta = meta.sort((a,b)=>{return b[this.state.rankingBy] - a[this.state.rankingBy]});
        }
        else {
            sortedMeta = meta.sort((a,b)=>{return a[this.state.rankingBy] - b[this.state.rankingBy]});
        }
        if(this.state.itemRankingBy == 'count'){
            sortedMetaItems = metaItems.sort((a,b)=>{return b[this.state.itemRankingBy] - a[this.state.itemRankingBy]});
        }
        else{
            sortedMetaItems = metaItems.sort((a,b)=>{return a[this.state.itemRankingBy] - b[this.state.itemRankingBy]});
        }
        return <div>
            <button className='nes-btn is-success' style={buttonStyle} onClick={this.props.toggleMeta}>Lobby</button>
            <div className='nes-container' style={{backgroundColor:'rgba(255,255,255,0.7)', margin:'10px', height: '90vh'}}>
                <Tabs>
                    <TabList>
                        <Tab key='team-comps'><p>Meta Report</p></Tab>
                        <Tab key='items'>Item Report</Tab>
                        <Tab key='discover'><p>Discover</p></Tab>
                    </TabList>

                    <TabPanel key='team-comps-panel'>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingRight:'27px', paddingLeft:'15px'}}>
                            <h3>Best Team Compositions</h3>
                            <div style={{display:'flex', width:'23%',alignItems:'center'}} className='nes-select'>
                                <p style={{marginRight:'20px'}}>Rank</p>
                                <select value={this.state.rankingBy} onChange={this.setRanking.bind(this)}>
                                    <option value="count">by popularity</option>
                                    <option value="mean_rank">by average place</option>
                                    <option value="winrate">by winrate</option>
                                </select>
                            </div>
                        </div>

                        <div style={{height:'70vh', overflowY:'scroll'}}>
                            {sortedMeta.map(team=>{
                                return <TeamComp team={team} key={team.cluster_id}/>;
                            })}
                        </div>
                    </TabPanel>
                    <TabPanel>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingRight:'27px', paddingLeft:'15px'}}>
                        <h3>Best Items</h3>
                        <div style={{display:'flex', width:'23%',alignItems:'center'}} className='nes-select'>
                            <p style={{marginRight:'20px'}}>Rank</p>
                            <select value={this.state.itemRankingBy} onChange={this.setItemRanking.bind(this)}>
                                <option value="count">by popularity</option>
                                <option value="rank">by average place</option>
                            </select>
                        </div>
                    </div>
                    <div style={{height:'70vh', overflowY:'scroll'}}>
                        {sortedMetaItems.map(item=>{
                            return <ItemStatistic item={item} key={item.name}/>;
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