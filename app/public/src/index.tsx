import ReactDOM from "react-dom"
import React, { Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Auth from "./pages/auth"
import Lobby from "./pages/lobby"
import Preparation from "./pages/preparation"
import Game from "./pages/game"
import AfterGame from "./pages/after-game"
import { Provider } from "react-redux"
import store from "./stores/index"

import "nes.css/css/nes.min.css"
import "./styles.css"

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Suspense fallback="loading">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/preparation" element={<Preparation />} />
            <Route path="/game" element={<Game />} />
            <Route path="/after" element={<AfterGame />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </React.StrictMode>
  </Provider>,

  document.getElementById("root")
)

if (navigator.serviceWorker) {
  navigator.serviceWorker.register("sw.js")
}
