import React, { Component } from 'react';
import DiscordButton from './discord-button';

class Media extends Component {
  render() {
    return (
        <div className="nes-container" style={{
          backgroundColor: 'rgba(255, 255, 255, .6)',
           width:'100%',
           bottom:'0px',
           height:'100px',
           display:'flex',
           padding:'5px',
           alignItems:'center',
           justifyContent:'space-between',
           position:'absolute'
           }}>
            <section className="icon-list" style={{marginBottom:'15px'}}>
                <a href="https://www.facebook.com/Pok%C3%A9mon-Auto-Chess-Espa%C3%B1ol-108035354419173">
                <i className="nes-icon facebook is-large"></i>
                </a>

                <a href="https://www.twitch.tv/ag_interactive">
                <i className="nes-icon twitch is-large"></i>
                </a>

                <a href="https://www.youtube.com/watch?v=sn68G5b-xkE">
                <i className="nes-icon youtube is-large"></i>
                </a>

            </section>

            <p>This is a non profit game. Only made by fans for fans.</p>

            <DiscordButton/>
            <button  type="button" onClick={this.handleTipeeClick.bind(this)} className="nes-btn is-warning">Donate</button>
            <button  type="button" className="nes-btn" onClick={this.handlePrivacyPolicyClick.bind(this)}>Privacy Policy</button>

        </div>
    );
  }

  handleTipeeClick(){
      window.location.href = 'https://fr.tipeee.com/pokemon-auto-chess';
  }

  handlePrivacyPolicyClick(){
      window.location.href = 'https://www.termsfeed.com/live/ddf4f373-8cdf-4efd-a547-c2a8e0a22a9a';
  }
}
export default Media;
