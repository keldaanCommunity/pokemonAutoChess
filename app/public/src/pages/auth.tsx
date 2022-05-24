import React from 'react'
import Login from './component/auth/login'
import Media from './component/auth/media'

const h1Style = {fontSize:'6vw', color:'white', textShadow: '2px 4px 3px rgba(0,0,0,0.3)', fontFamily:'"Press Start 2P"'}

export default function Auth() {
  return (
    <div className="App">
        <div style={{display:'flex', justifyContent:'space-around', height:'100vh'}}>
            <div style={{display:'flex', flexFlow:'column', width:'30vw', justifyContent:'space-around'}}>
                <div style={{display:'flex', flexFlow:'column', alignItems:'start'}}>
                    <h1 style={h1Style}>Pokemon</h1>
                    <h1 style={h1Style}>Auto</h1>
                    <h1 style={h1Style}>Chess</h1>
                </div>
                <Login/>
            </div>
            <div style={{display:'flex', flexFlow:'column', justifyContent:'space-around', alignItems:'center'}}>
            <img src='assets/ui/pokemon_autochess_final.svg' style={{height:'70vh'}}/>
                <Media/>
            </div>
        </div>
    </div> 
    )
}