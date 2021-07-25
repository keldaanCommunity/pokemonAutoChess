import React, { Component } from 'react';
import Login from './component/login';
import Media from './component/media';

class Auth extends Component {
  render() {
    return (
    <div className="App">
      <Login/>
      <Media/>
    </div> 
    );
  }
}
export default Auth;
