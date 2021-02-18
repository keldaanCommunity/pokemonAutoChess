class HomePage {
  constructor(args) {
    this.render();
    this.addEventListeners();
  }

  render() {
    const content = document.createElement('div');
    content.setAttribute('id', 'home');
    content.style.padding = '5px';
    content.innerHTML = `
    <div class="nes-container with-title is-centered" style="height:30%; margin-left:15%;margin-top:15%; background-color: rgba(255, 255, 255, .5);">
      <p class="title" style="">Game</p>
      <h1 style= "font-size:50px; margin-bottom:40px;">Pokemon Auto Chess</h1>
      <button id="button-play" type="button" class="nes-btn is-success"><h3>Play !</h3></button>
    </div>
    
    <div class="nes-container with-title is-centered" style="width:20%; height:30%; margin:10px; background-color: rgba(255, 255, 255, .5);">
    <p class="title">Media</p>
    
    <section class="icon-list" style="margin-bottom:15px;">
    <!-- facebook -->
    <a href="https://www.facebook.com/Pok%C3%A9mon-Auto-Chess-Espa%C3%B1ol-108035354419173">
    <i class="nes-icon facebook is-large"></i>
    </a>
    
    <!-- github -->
    <a href="https://github.com/arnaudgregoire/pokemonAutoChess">
    <i class="nes-icon github is-large"></i>
    </a>
    
    <!-- twitch -->
    <a href="https://www.twitch.tv/ag_interactive">
    <i class="nes-icon twitch is-large"></i>
    </a>
    
    <!-- youtube -->
    <a href="https://www.youtube.com/watch?v=sn68G5b-xkE">
    <i class="nes-icon youtube is-large"></i>
    </a>
    </i>
    </section>
    <button type="button" class="nes-btn is-error" onclick="location.href = 'https://discord.gg/6JMS7tr';">Join Discord</button>
    <p style="margin-top:10px;">This is a non profit game. Only made by fans for fans.</p>
    </div>
    <img src="assets/ui/chrysacier.gif" style="position:absolute; top:160px; left:580px;"/>
`;
    document.body.innerHTML = '';
    document.body.appendChild(content);
  }

  addEventListeners() {
    document.getElementById('button-play').addEventListener('click', (e) => {
      window.dispatchEvent(new CustomEvent('render-login'));
    });
  }
}

export default HomePage;
