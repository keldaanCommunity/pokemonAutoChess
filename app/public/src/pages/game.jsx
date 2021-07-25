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
        console.log(this.container);
        console.log(this.container.current);
        this.game = new GameContainer(this.container.current, this.uid);
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
