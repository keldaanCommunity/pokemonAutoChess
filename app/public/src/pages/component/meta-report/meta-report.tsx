import React, { useState} from 'react'
import TeamComp from './team-comp'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Discover from './discover'
import ItemStatistic from './item-statistic'
import { IMeta } from '../../../../../models/mongo-models/meta'
import { IItemsStatistic } from '../../../../../models/mongo-models/items-statistic'
import BotReport from './bot-report'

const buttonStyle= {
    marginLeft:'10px',
    marginTop:'10px',
    marginRight:'10px'
}

const optStyle={
    color:'black'
}

const tabStyle={
    fontSize:'1.2vw'
}

export default function MetaReport(props: {meta: IMeta[], metaItems: IItemsStatistic[], toggleMeta: () => void}){
    const [rankingBy, setRanking] = useState<string>('count')
    const [itemRankingBy, setItemRanking] = useState<string>('count')

    const meta = props.meta.slice()
    const metaItems = props.metaItems.slice()
    let sortedMeta = new Array<IMeta>()
    let sortedMetaItems = new Array<IItemsStatistic>()
    if(rankingBy == 'count' || rankingBy == 'winrate') {
        sortedMeta = meta.sort((a,b)=>{return b[rankingBy] - a[rankingBy]})
    }
    else {
        sortedMeta = meta.sort((a,b)=>{return a[rankingBy] - b[rankingBy]})
    }
    if(itemRankingBy == 'count'){
        sortedMetaItems = metaItems.sort((a,b)=>{return b[itemRankingBy] - a[itemRankingBy]})
    }
    else{
        sortedMetaItems = metaItems.sort((a,b)=>{return a[itemRankingBy] - b[itemRankingBy]})
    }
    return <div>
        <button className='bubbly-success is-success' style={buttonStyle} onClick={props.toggleMeta}>Lobby</button>
        <div className='nes-container' style={{margin:'10px', height: '90vh', color:'white'}}>
            <Tabs>
                <TabList>
                    <Tab key='team-comps'><p className='my-cursor' style={tabStyle}>Meta Report</p></Tab>
                    <Tab key='items'><p className='my-cursor' style={tabStyle}>Item Report</p></Tab>
                    <Tab key='bots'><p className='my-cursor' style={tabStyle}>Bot Report</p></Tab>
                    <Tab key='discover'><p className='my-cursor' style={tabStyle}>Discover</p></Tab>
                </TabList>

                <TabPanel key='team-comps-panel'>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingRight:'27px', paddingLeft:'15px'}}>
                        <h3>Best Team Compositions</h3>
                        <div style={{display:'flex', width:'23%',alignItems:'center', justifyContent:'space-around',backgroundColor:'rgb(84, 89, 107)'}} className='my-select'>
                            <p style={{margin:'0px'}}>Rank</p>
                            <select className='my-cursor' value={rankingBy} onChange={(e)=>{setRanking(e.target.value)}} style={{background:'none', border:'none', color:'white'}}>
                                <option style={optStyle} value="count">by popularity</option>
                                <option style={optStyle} value="mean_rank">by average place</option>
                                <option style={optStyle} value="winrate">by winrate</option>
                            </select>
                        </div>
                    </div>

                    <div style={{height:'70vh', overflowY:'scroll'}}>
                        {sortedMeta.map(team=>{
                            return <TeamComp team={team} key={team.cluster_id}/>
                        })}
                    </div>
                </TabPanel>
                <TabPanel>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingRight:'27px', paddingLeft:'15px'}}>
                    <h3>Best Items</h3>
                    <div style={{display:'flex', width:'23%',alignItems:'center', justifyContent:'space-around',backgroundColor:'rgb(84, 89, 107)'}} className='my-select'>
                        <p style={{margin:'0px'}}>Rank</p>
                        <select className='my-cursor' value={itemRankingBy} onChange={(e)=>{setItemRanking(e.target.value)}} style={{background:'none', border:'none', color:'white'}}>
                            <option style={optStyle} value="count">by popularity</option>
                            <option style={optStyle} value="rank">by average place</option>
                        </select>
                    </div>
                </div>
                <div style={{height:'70vh', overflowY:'scroll'}}>
                    {sortedMetaItems.map(item=>{
                        return <ItemStatistic item={item} key={item.name}/>
                    })}
                </div>
                </TabPanel>
                <TabPanel key='bot-report-panel'>
                    <BotReport/>
                </TabPanel>
                <TabPanel key='discover-panel'>
                    <Discover meta={sortedMeta}/>
                </TabPanel>
            </Tabs>
            

        </div>
    </div>
}