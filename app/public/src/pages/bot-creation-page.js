class BotCreationPage {
    constructor(args) {
      this.render();
      this.addEventListeners();
    }
  
    render() {
      const content = document.createElement('div');
      content.setAttribute('id', 'bot-creation');
      content.style.padding = '5px';
      content.innerHTML = `
      <div class="nes-container with-title is-centered" style="background-color: rgba(255, 255, 255, .5);">
        <p class="title" style="">Bot Creation</p>
      </div>
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
  
  export default BotCreationPage;
  