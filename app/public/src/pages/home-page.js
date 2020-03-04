
class HomePage {
  constructor(args) {
    this.render();
    this.addEventListeners();
  }
  
  render() {
    var content = document.createElement("div");
    content.setAttribute("id", "home");
    content.innerHTML = `
    <header><h1>Pokemon: Auto Chess</h1></header>
    <main>
    <img src="assets/ui/logo-pac.png" alt="Logo: Pokemon Auto Chess" />
    <button id="button-play">Play</button>
    </main>
    <footer>
    <a href="https://github.com/arnaudgregoire/pokemonAutoChess">
      <img src="assets/ui/logo-github.png" alt="Logo: Github" />
    </a>
    <img src="assets/ui/logo-agi.png" alt="Logo: AG Interactive" />
    <a href="https://colyseus.io/">
      <img src="assets/ui/logo-colyseus.png" alt="Logo: Colyseus" />
    </a>
    </footer>`;
    document.body.innerHTML = "";
    document.body.appendChild(content);
  }

  addEventListeners() {
    document.getElementById("button-play").addEventListener("click", e => {
      window.dispatchEvent(new CustomEvent("render-login"));
    });  
  }
}

export default HomePage;