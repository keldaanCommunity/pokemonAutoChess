import React from 'react';
import Login from './component/auth/login';
import Media from './component/auth/media';

export default function Auth() {
  return (
    <div className="App">
      <Login/>
      <Media/>
    </div> 
    );
}