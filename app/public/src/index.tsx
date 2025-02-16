import React, { Suspense } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AfterGame from "./pages/after-game"
import Auth from "./pages/auth"
import BotBuilder from "./pages/component/bot-builder/bot-builder"
import { BotManagerPanel } from "./pages/component/bot-builder/bot-manager-panel"
import MapViewer from "./pages/component/debug/map-viewer"
import Game from "./pages/game"
import Lobby from "./pages/lobby"
import Preparation from "./pages/preparation"
import { SpriteDebug } from "./pages/sprite-viewer"
import { Gameboy } from "./pages/gameboy"
import store from "./stores/index"

import "./i18n"
import "./style/index.css"

// Redirect top window if running in an iframe
if (window.top && window !== window.top) {
  window.top.location = window.location;
}

const container = document.getElementById("root")
const root = createRoot(container!)

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <Suspense fallback="loading">
        <BrowserRouter future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/preparation" element={<Preparation />} />
            <Route path="/game" element={<Game />} />
            <Route path="/after" element={<AfterGame />} />
            <Route path="/bot-builder" element={<BotBuilder />} />
            <Route path="/bot-admin" element={<BotManagerPanel />} />
            <Route path="/sprite-viewer" element={<SpriteDebug />} />
            <Route path="/map-viewer" element={<MapViewer />} />
            <Route path="/gameboy" element={<Gameboy />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </React.StrictMode>
  </Provider>
)

if (navigator.serviceWorker) {
  navigator.serviceWorker.register("sw.js")
}
