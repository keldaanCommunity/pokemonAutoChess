import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PKM } from '../../../models/enum';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class TeamBuilder extends Component {

    constructor(props){
        super(props);
        this.state = {
            step: 0,
            steps: [
                {
                  'roundsRequired': 0,
                  'board': [
                    {
                      'name': PKM.HOPPIP,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.HOPPIP,
                      'x': 4,
                      'y': 3
                    }
                  ]
                },
                {
                  'roundsRequired': 1,
                  'board':
                  [
                    {
                      'name': PKM.HOPPIP,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.CHIKORITA,
                      'x': 3,
                      'y': 1
                    },
                    {
                      'name': PKM.CATERPIE,
                      'x': 4,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.HORSEA,
                      'x': 5,
                      'y': 1
                    },
                    {
                      'name': PKM.SQUIRTLE,
                      'x': 4,
                      'y': 2
                    },
                    {
                      'name': PKM.MUDKIP,
                      'x': 4,
                      'y': 3
                    },
                    {
                      'name': PKM.PIPLUP,
                      'x': 5,
                      'y': 3
                    }
                  ]
                },
                {
                  'roundsRequired': 2,
                  'board':
                  [
                    {
                      'name': PKM.HORSEA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.SQUIRTLE,
                      'x': 4,
                      'y': 2
                    },
                    {
                      'name': PKM.MUDKIP,
                      'x': 4,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 3,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 2,
                  'board':
                  [
                    {
                      'name': PKM.HORSEA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.SQUIRTLE,
                      'x': 4,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 4,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.TOTODILE,
                      'x': 3,
                      'y': 3
                    }
                  ]
                },
                {
                  'roundsRequired': 2,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 4,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 4,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.TOTODILE,
                      'x': 3,
                      'y': 3
                    }
                  ]
                },
                {
                  'roundsRequired': 1,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 4,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 4,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWAG,
                      'x': 5,
                      'y': 1
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWAG,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    }
                  ]
                },
                {
                  'roundsRequired': 1,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    }
                  ]
                },
                {
                  'roundsRequired': 4,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    }
                  ]
                },
                {
                  'roundsRequired': 4,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.PRINPLUP,
                      'x': 3,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 5,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.PRINPLUP,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SPHEAL,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.WARTORTLE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.PRINPLUP,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 5,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.BLASTOISE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.MARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.PRINPLUP,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 2,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.BLASTOISE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.AZUMARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.PRINPLUP,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.BLASTOISE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.AZUMARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.CROCONAW,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.EMPOLEON,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.BLASTOISE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.MARSHTOMP,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.AZUMARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.FERALIGATR,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.EMPOLEON,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.BLASTOISE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.SWAMPERT,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.AZUMARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.FERALIGATR,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LOMBRE,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.EMPOLEON,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.BLASTOISE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.SWAMPERT,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.AZUMARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLIWHIRL,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.FERALIGATR,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LUDICOLO,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.EMPOLEON,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                },
                {
                  'roundsRequired': 3,
                  'board':
                  [
                    {
                      'name': PKM.SEADRA,
                      'x': 4,
                      'y': 1
                    },
                    {
                      'name': PKM.BLASTOISE,
                      'x': 2,
                      'y': 2
                    },
                    {
                      'name': PKM.SWAMPERT,
                      'x': 2,
                      'y': 3
                    },
                    {
                      'name': PKM.AZUMARILL,
                      'x': 1,
                      'y': 2
                    },
                    {
                      'name': PKM.POLITOED,
                      'x': 1,
                      'y': 1
                    },
                    {
                      'name': PKM.FERALIGATR,
                      'x': 1,
                      'y': 3
                    },
                    {
                      'name': PKM.LUDICOLO,
                      'x': 2,
                      'y': 1
                    },
                    {
                      'name': PKM.EMPOLEON,
                      'x': 3,
                      'y': 2
                    },
                    {
                      'name': PKM.SEALEO,
                      'x': 0,
                      'y': 2
                    }
                  ]
                }
              ]
        };
    }

  render() {
      
    const buttonStyle= {
        position:'absolute',
        top:'10px',
        left:'10px'
    }

    const tabStyle = {
        backgroundColor: 'rgba(255, 255, 255, .6)',
        margin:'10px'
    }

    const teamBuilderStyle = {
        display:'flex',
        justifyContent:'space-between',
        flexFlow:'column',
        alignItems:'center',
        height:'100%'
    }

    const cursorStyle = {
        cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
    }

    const tdStyle = {
        width:'100px',
        height:'100px'
    }

    const imgStyle = {
        width:'80px',
        height:'80px',
        imageRendering:'pixelated'
    }

    const tabPaneStyle = {
        display:'flex',
        justifyContent:'center'
    }

    const tableStyle = {
        backgroundColor:'rgba(255,255,255,0.7)'
    }

    return <div className="App">
            <Link to='/auth'>
                <button className='nes-btn is-primary' style={buttonStyle}>Lobby</button>
            </Link>
            <div style={teamBuilderStyle}>
                <Tabs className="nes-container" style={tabStyle}
                    selectedIndex={this.state.step} onSelect={i => this.setState({step:i})}>

                        <TabList>
                            {this.state.steps.map((step,i)=>{
                                return <Tab style={cursorStyle} key={i}><p>{i}</p></Tab>
                            })}
                        </TabList>

                        {this.state.steps.map((step,i)=>{
                            return <TabPanel style={tabPaneStyle} key={i}>
                                <table style={tableStyle} className='nes-table is-bordered is-centered'>
                                    <tbody>
                                        {[3,2,1,0].map(y => {
                                            return <tr key={y}>
                                                {[0,1,2,3,4,5,6,7].map(x=>{
                                                    let r = <td style={tdStyle} key={x}></td>;
                                                    this.state.steps[i].board.forEach(p=>{
                                                        if(p.x == x && p.y == y){
                                                            r = <td style={tdStyle} key={x}> <img style={imgStyle} src={'assets/avatar/'+ p.name +'.png'}></img></td>
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
                <div className='nes-container' style={{
                    display:'flex',
                    flexWrap:'wrap',
                    backgroundColor:'rgb(255,255,255,0.7)',
                    margin:'10px'
                    }}>
                    {Object.keys(PKM).map(key=>{
                        return <div key={key}><img src={'assets/avatar/' + PKM[key] + '.png'} /></div>;
                    })}
                </div>
            </div>
        </div>
    ; 
  }
}
export default TeamBuilder;
