import ReactDOM from 'react-dom';
import React from 'react';
import App from './pages/app';
import { BrowserRouter } from 'react-router-dom';

window.endpoint = `${window.location.protocol.replace('http', 'ws')}//${window.location.host}`;

ReactDOM.render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), document.getElementById('root'));
