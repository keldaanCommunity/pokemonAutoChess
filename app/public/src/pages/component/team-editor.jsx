import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {PKM} from '../../../../models/enum';
import ReactTooltip from 'react-tooltip';

const tabStyle = {
    backgroundColor: 'rgba(255, 255, 255, .7)',
    margin:'10px',
    marginTop:'0px',
    width:'60%',
    position:'absolute',
    top:'8.5%',
    left:'13%'
}

const cursorStyle = {
    cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
}

const tdStyle = {
    width:'80px',
    height:'80px',
    cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`,
    padding:'0px'
}

const divTdStyle = {
  display:'flex',
  justifyContent:'space-between',
  flexFlow:'column',
  width:'80px',
  height:'80px'
}

const bigImgStyle={
  width:'80px',
  height:'80px',
  imageRendering:'pixelated',
  cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
}

const tabPaneStyle = {
    display:'flex',
    justifyContent:'center'
}

const labelStyle={
    marginLeft:'10px'
}

const itemImgStyle={
    height:'20px',
    width:'20px',
    position:'relative',
    bottom:'20px',
    borderRadius:'10px',
    border:'1px solid white',
    backgroundColor:'white'
}

class TeamEditor extends Component{
    render(){
        return <div className="nes-container" style={tabStyle}>
            
            <div style={{display:'flex'}}>
                <div className="nes-field is-inline">
                    <label style={labelStyle} htmlFor="inline_field">ID</label>
                    <input onChange={this.props.handleIdChange} type="text" id="inline_field" className="nes-input" placeholder="Id" value={this.props.id}/>
                </div>
                <div className="nes-field is-inline">
                    <label style={labelStyle} htmlFor="default_select">Avatar</label>
                    <div style={{width:'auto'}} className="nes-select">
                    <select value={this.props.avatar} onChange={this.props.handleAvatarChange} id="default_select">
                        {Object.keys(PKM).sort((a,b)=>{return PKM[a].localeCompare(PKM[b])}).map(key=>{
                            return <option key={key} value={PKM[key]}>{PKM[key]}</option>;
                        })};
                    </select>
                </div>
                </div>
                <div className="nes-field is-inline">
                    <label style={labelStyle} htmlFor="inline_field">Author</label>
                    <input onChange={this.props.handleAuthorChange} type="text" id="inline_field" className="nes-input" placeholder="Author Name" value={this.props.author}/>
                </div>
            </div>

            <Tabs selectedIndex={this.props.step} onSelect={i => {this.props.handleTabClick(i)}}>

            <TabList
            data-tip
            data-for={'tablist-board'}>
                <ReactTooltip id={'tablist-board'}
                    className='customeTheme' 
                    textColor='#000000' 
                    backgroundColor='rgba(255,255,255,1)' 
                    effect='solid'>
                    <p>To create a bot, you need to fill a certain number of steps.</p>
                    <p>Each step represents the state of your bot at a moment in the game</p>
                    <p>The bot will start with the team defined on step 1. Then, it will go to step 2 and so on</p>
                    <p>The team of the step 2 should always be stronger than the step 1 team</p>
                    <p>As the player cannot get more than 10 pokemons/step, your bot is not allowed too.</p>
                </ReactTooltip>
                
                {this.props.steps.map((step,i)=>{
                    return <Tab style={cursorStyle} key={i}>
                        <p>{i}</p>
                    </Tab>
                })}
            </TabList>

            {this.props.steps.map((step,i)=>{
                return <TabPanel style={tabPaneStyle} key={i}>
                    <div>
                        <div style={{display:'flex',alignItems:'center', justifyContent:'center',marginBottom:'10px'}}>
                            <label htmlFor="default_select"
                                data-tip
                                data-for={'step-' + i}>
                                <ReactTooltip id={'step-' + i}
                                    className='customeTheme' 
                                    textColor='#000000' 
                                    backgroundColor='rgba(255,255,255,1)' 
                                    effect='solid'>
                                    <p>Points required represent how much your bot needs to work to get to the next step</p>
                                    <p>Once your bot has acquired enough points, it will go to the next step</p>
                                    <ul class="nes-list is-disc">
                                        <li>For a victory, your bot will get 1.5 point</li>
                                        <li>For a defeat or a draw, your bot will get 1 point</li>
                                    </ul>
                                    <p>The more points you require, the longer the bot will stay on this step</p>
                                </ReactTooltip>
                                Points required</label>
                            <div className="nes-select" style={{width:'auto'}}>
                                    <select onChange={this.props.handleRoundsRequiredChange} value={this.props.steps[i].roundsRequired}>
                                    <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                    </select>
                                </div>
                            </div>
                        <div style={{marginBottom:'10px', display:'flex', justifyContent:'center'}}>
                            <table className='nes-table is-bordered is-centered'>
                                <tbody>
                                    {[3,2,1,0].map(y => {
                                        return <tr key={y}>
                                            {[0,1,2,3,4,5,6,7].map(x=>{
                                                let r = <td style={tdStyle} onClick={()=>{this.props.handleEditorClick(x,y)}} key={x}></td>;
                                                this.props.steps[i].board.forEach(p=>{
                                                    if(p.x == x && p.y == y){
                                                        r = <td style={tdStyle} onClick={()=>{this.props.handleEditorClick(x,y)}} key={x}>
                                                        <div style={divTdStyle}>
                                                            <img style={bigImgStyle} src={'assets/avatar/'+ p.name +'.png'}></img>
                                                            {p.items ? <div style={{display:'flex', justifyContent:'space-evenly'}}>{p.items.map((it,j)=>{
                                                                return <img key={j} style={itemImgStyle} src={'assets/items/' + it + '.png'}/>
                                                            })}</div>: null}
                                                        </div>
                                                    </td>
                                                    }
                                                });
                                                return r;
                                            })}  
                                        </tr>
                                    })}
                                </tbody>
                            </table> 
                        </div>
                    </div>

   
                </TabPanel>
            })}
            </Tabs>
            </div>;
    }
}

export default TeamEditor;