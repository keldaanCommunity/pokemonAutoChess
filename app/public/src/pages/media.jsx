import React, { Component } from 'react';


class Media extends Component {
  render() {
    return (
        <div className="nes-container with-title is-centered" style={{backgroundColor: 'rgba(255, 255, 255, .6)', width:'30%'}}>
            <p className="title">Media</p>
            
            <section className="icon-list" style={{marginBottom:'15px'}}>
                <a href="https://www.facebook.com/Pok%C3%A9mon-Auto-Chess-Espa%C3%B1ol-108035354419173">
                <i className="nes-icon facebook is-large"></i>
                </a>

                <a href="https://github.com/arnaudgregoire/pokemonAutoChess">
                <i className="nes-icon github is-large"></i>
                </a>

                <a href="https://www.twitch.tv/ag_interactive">
                <i className="nes-icon twitch is-large"></i>
                </a>

                <a href="https://www.youtube.com/watch?v=sn68G5b-xkE">
                <i className="nes-icon youtube is-large"></i>
                </a>

            </section>

            <button type="button" className="nes-btn is-error" onClick={this.handleDiscordClick.bind(this)}>Join Discord</button>
            <button  type="button" onClick={this.handleTipeeClick.bind(this)} className="nes-btn is-warning">Donate</button>
            <button  type="button" className="nes-btn" onClick={this.handlePrivacyPolicyClick.bind(this)}>Privacy Policy</button>
            <p>This is a non profit game. Only made by fans for fans.</p>
        </div>
    );
  }

  handleDiscordClick(){
    window.location.href = 'https://discord.gg/6JMS7tr'
  }

  handleTipeeClick(){
      window.location.href = 'https://fr.tipeee.com/pokemon-auto-chess';
  }

  handlePrivacyPolicyClick(){
      window.location.href = 'https://www.termsfeed.com/live/ddf4f373-8cdf-4efd-a547-c2a8e0a22a9a';
  }
}
export default Media;
