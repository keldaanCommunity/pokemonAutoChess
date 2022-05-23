import React from 'react'
import Login from './component/auth/login'
import Media from './component/auth/media'

export default function Auth() {
  return (
    <div className="App">
        <div style={{display:'flex', justifyContent:'space-around'}}>
            <div style={{display:'flex', flexFlow:'column'}}>
                <h1>Pokemon Auto Chess</h1>
                <Login/>
            </div>
            <div style={{display:'flex', flexFlow:'column', justifyContent:'space-around'}}>
            <img
                src='assets/ui/pokemon_autochess_final.svg'
                height="600px"
                />
                <Media/>
            </div>
        </div>
    </div> 
    )
}