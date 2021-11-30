import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

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

const imgStyle = {
    width:'40px',
    height:'40px',
    imageRendering:'pixelated',
    cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
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

class TeamEditor extends Component{
    render(){
        return <div className="nes-container" style={tabStyle}>
            
            <div style={{display:'flex'}}>
                <div className="nes-field is-inline">
                    <label style={labelStyle} htmlFor="inline_field">ID</label>
                    <input onChange={this.props.handleIdChange} type="text" id="inline_field" className="nes-input" placeholder="Id" value={this.props.id}/>
                </div>
                <div className="nes-field is-inline">
                    <label style={labelStyle} htmlFor="inline_field">Avatar</label>
                    <input onChange={this.props.handleAvatarChange} type="text" id="inline_field" className="nes-input" placeholder="Avatar Name" value={this.props.avatar}/>
                </div>
                <div className="nes-field is-inline">
                    <label style={labelStyle} htmlFor="inline_field">Author</label>
                    <input onChange={this.props.handleAuthorChange} type="text" id="inline_field" className="nes-input" placeholder="Author Name" value={this.props.author}/>
                </div>
            </div>

            <Tabs selectedIndex={this.props.step} onSelect={i => {this.props.handleTabClick(i)}}>

            <TabList>
                {this.props.steps.map((step,i)=>{
                    return <Tab style={cursorStyle} key={i}><p>{i}</p></Tab>
                })}
            </TabList>

            {this.props.steps.map((step,i)=>{
                return <TabPanel style={tabPaneStyle} key={i}>
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
                                                        return <img key={j} style={{height:'20px', width:'20px', position:'relative', bottom:'20px'}} src={'assets/items/' + it + '.png'}/>
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
                </TabPanel>
            })}
            </Tabs>
            </div>;
    }
}

export default TeamEditor;