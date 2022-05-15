import React from 'react'
import { Link } from 'react-router-dom'
import 'nes.css/css/nes.min.css'

export default function Home() {
  return (
    <div className="App">
      <div className="nes-container with-title is-centered" style={{height:'30%', marginLeft:'15%', marginTop:'15%', marginRight:'15%',backgroundColor: 'rgba(255, 255, 255, .6)'}}>
        <p className="title">Game</p>
        <h1 style={{fontSize:'50px', marginBottom:'40px'}}>Pokemon Auto Chess</h1>
        <Link to={'./auth'}>
          <button id="button-play" type="button" className="nes-btn is-success"><h3>Play !</h3></button>
        </Link>
      </div>
    </div>
    )
}