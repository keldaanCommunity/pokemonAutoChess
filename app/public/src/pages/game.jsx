import React, { Component } from 'react';
import GameContainer from '../game/game-container';
import firebase from 'firebase/app';

class Game extends Component {

    constructor(props){
        super(props);
        window.langage = 'eng';
        this.container = React.createRef();
        this.uid = firebase.auth().currentUser.uid;
    }

    componentDidMount(){
        this.game = new GameContainer(this.container.current, this.uid);
        document.getElementById('game').addEventListener('shop-click', this.game.onShopClick.bind(this.game));
        document.getElementById('game').addEventListener('player-click', this.game.onPlayerClick.bind(this.game));
        document.getElementById('game').addEventListener('refresh-click', this.game.onRefreshClick.bind(this.game));
        document.getElementById('game').addEventListener('lock-click', this.game.onLockClick.bind(this.game));
        document.getElementById('game').addEventListener('level-click', this.game.onLevelClick.bind(this.game));
        document.getElementById('game').addEventListener('drag-drop', this.game.onDragDrop.bind(this.game));
        document.getElementById('game').addEventListener('sell-drop', this.game.onSellDrop.bind(this.game));
        document.getElementById('game').addEventListener('leave-game', this.game.onLeaveGame.bind(this.game));
    }

    componentWillUnmount(){
      document.getElementById('game').removeEventListener('shop-click', this.game.onShopClick.bind(this.game));
      document.getElementById('game').removeEventListener('player-click', this.game.onPlayerClick.bind(this.game));
      document.getElementById('game').removeEventListener('refresh-click', this.game.onRefreshClick.bind(this.game));
      document.getElementById('game').removeEventListener('lock-click', this.game.onLockClick.bind(this.game));
      document.getElementById('game').removeEventListener('level-click', this.game.onLevelClick.bind(this.game));
      document.getElementById('game').removeEventListener('drag-drop', this.game.onDragDrop.bind(this.game));
      document.getElementById('game').removeEventListener('sell-drop', this.game.onSellDrop.bind(this.game));
      document.getElementById('game').removeEventListener('leave-game', this.game.onLeaveGame.bind(this.game));
    }

  render() {
    return (
    <main style={{display:'flex'}}>
        <div id='game' ref={this.container}></div>
    </main>
    );
  }
}
export default Game;
