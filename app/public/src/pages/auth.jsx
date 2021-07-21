import React, { Component } from 'react';
import Media from './media';

class Auth extends Component {
  render() {
    return (
    <div className="App" style={{display:'flex', padding:'10px', justifyContent:'space-between'}}>
      <div id="play-panel" className="nes-container with-title is-centered" style={{backgroundColor: 'rgba(255, 255, 255, .6)', width:'30%'}}>
        <p className="title">Authentification</p>
        <h1 style={{fontSize:'50px', marginBottom:'40px'}}>Pokemon Auto Chess</h1>
        <button id="button-guest" type="button" className="nes-btn is-success">Login as guest</button>
        <button id="display-login" type="button" className="nes-btn is-warning">Log with email</button>
        <button id="button-fb" type="button" className="nes-btn is-primary">Log with Facebook</button>
      </div>
      <Media/>
    </div> 
    );
  }
}
export default Auth;
