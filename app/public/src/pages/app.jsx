import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './home';
import Auth from './auth';
import Lobby from './lobby';
import Preparation from './preparation';
import Game from './game';
import AfterGame from './after-game';
import TeamBuilder from './team-builder';

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/auth' component={Auth}/>
          <Route path='/lobby' component={Lobby}/>
          <Route path='/preparation' component={Preparation}/>
          <Route path='/game' component={Game}/>
          <Route path='/after' component={AfterGame}/>
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}

export default App;
