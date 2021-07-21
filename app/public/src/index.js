import ReactDOM from 'react-dom';
import React from 'react';
import App from './pages/app';
import { Client } from 'colyseus.js'
import { BrowserRouter } from 'react-router-dom';

const endpoint = `${window.location.protocol.replace('http', 'ws')}//${window.location.host}`;
window._client = new Client(endpoint);

ReactDOM.render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), document.getElementById('root'));
