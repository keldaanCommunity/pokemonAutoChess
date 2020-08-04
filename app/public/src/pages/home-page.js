class HomePage {
  constructor(args) {
    this.render();
    this.addEventListeners();
  }

  render() {
    const content = document.createElement('div');
    content.setAttribute('id', 'home');
    content.innerHTML = `
    <header>
    <h1>Pokemon: Auto Chess</h1>
    </header>
    <main>
    <img src="assets/ui/logo-pac.png" alt="Logo: Pokemon Auto Chess" />
    <button id="button-play">Play</button>
    </main>
    <footer>

    <a href="https://discord.gg/6JMS7tr">
    <img src="https://img.shields.io/discord/737230355039387749.svg?style=for-the-badge&colorB=7581dc&logo=discord&logoColor=white">
    </a>
    <p>
    This is a non profit game. Only made by fans for fans.
    </p>
    <a href="https://github.com/arnaudgregoire/pokemonAutoChess">
      <img src="assets/ui/logo-github.png" alt="Logo: Github" />
    </a>
    <img src="assets/ui/logo-agi.png" alt="Logo: AG Interactive" />
    <a href="https://colyseus.io/">
      <img src="assets/ui/logo-colyseus.png" alt="Logo: Colyseus" />
    </a>
    <a href="https://phaser.io/">
    <img src="assets/ui/logo-phaser.png" alt="Logo: Phaser" />
  </a>
    
    </footer>`;
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
