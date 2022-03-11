import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Auth from './pages/auth';
import Lobby from './pages/lobby';
import Preparation from './pages/preparation';
import Game from './pages/game';
import AfterGame from './pages/after-game';

ReactDOM.render((
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/auth' element={<Auth/>}/>
          <Route path='/lobby' element={<Lobby/>}/>
          <Route path='/preparation' element={<Preparation/>}/>
          <Route path='/game' element={<Game/>}/>
          <Route path='/after' element={<AfterGame/>}/>
        </Routes>
    </BrowserRouter>
), document.getElementById('root'));
