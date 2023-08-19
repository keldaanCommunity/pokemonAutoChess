import { createRoot } from "react-dom/client"
import React, { Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Auth from "./pages/auth"
import Lobby from "./pages/lobby"
import Preparation from "./pages/preparation"
import Game from "./pages/game"
import AfterGame from "./pages/after-game"
import TeamBuilder from "./pages/component/bot-builder/team-builder"
import { BotManagerPanel } from "./pages/component/bot-builder/bot-manager-panel"
import { Provider } from "react-redux"
import { SpriteDebug } from "./pages/sprite-debug"
import store from "./stores/index"

import "./i18n"
import "nes.css/css/nes.min.css"
import "./styles.css"

const container = document.getElementById("root")
const root = createRoot(container!)

root.render(
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
            <Route path="/bot-builder" element={<TeamBuilder />} />
            <Route path="/bot-admin" element={<BotManagerPanel />} />
            <Route path="/sprite-debug" element={<SpriteDebug />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </React.StrictMode>
  </Provider>
)

if (navigator.serviceWorker) {
  navigator.serviceWorker.register("sw.js")
}
