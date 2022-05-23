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
        <div className='nes-container' style={{backgroundColor:'rgba(255,255,255,0.7)', margin:'10px', height: '90vh'}}>
            <Tabs>
                <TabList>
                    <Tab key='team-comps'><p>Meta Report</p></Tab>
                    <Tab key='items'>Item Report</Tab>
                    <Tab key='bots'>Bot Report</Tab>
                    <Tab key='discover'><p>Discover</p></Tab>
                </TabList>

                <TabPanel key='team-comps-panel'>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingRight:'27px', paddingLeft:'15px'}}>
                        <h3>Best Team Compositions</h3>
                        <div style={{display:'flex', width:'23%',alignItems:'center'}} className='nes-select'>
                            <p style={{marginRight:'20px'}}>Rank</p>
                            <select value={rankingBy} onChange={(e)=>{setRanking(e.target.value)}}>
                                <option value="count">by popularity</option>
                                <option value="mean_rank">by average place</option>
                                <option value="winrate">by winrate</option>
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
                    <div style={{display:'flex', width:'23%',alignItems:'center'}} className='nes-select'>
                        <p style={{marginRight:'20px'}}>Rank</p>
                        <select value={itemRankingBy} onChange={(e)=>{setItemRanking(e.target.value)}}>
                            <option value="count">by popularity</option>
                            <option value="rank">by average place</option>
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