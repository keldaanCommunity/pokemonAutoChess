import React, { Component } from 'react';
import Login from './login';
import Media from './media';

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
