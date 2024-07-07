import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { PreloadingScene } from "../../../game/scenes/preloading-scene"
import "./game-files.css"

export default function GameFiles() {
  const { t } = useTranslation()
  const [version, setVersion] = useState("")
  const [cached, setCached] = useState(false)
  const askingSW = useRef<boolean>(false)
  const preloadingScene = useRef<PreloadingScene>()
  const [preloadingMessage, setPreloadingMessage] = useState<string>(
    t("preloading_start")
  )
  const [preloading, setPreloading] = useState<boolean>(false)
  const [preloadingPc, setPreloadingPc] = useState(0)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (
      navigator.serviceWorker.controller != null &&
      !askingSW.current &&
      version === ""
    ) {
      askingSW.current = true
      navigator.serviceWorker.controller.postMessage({
        type: "CACHE_STATUS"
      })

      //listen to messages
      navigator.serviceWorker.onmessage = (event) => {
        if (event.data && event.data.type === "CACHE_STATUS") {
          console.log("Service worker responded", event.data)
          setVersion(event.data.version)
          setCached(event.data.cached)
          askingSW.current = false
        }
      }
    }
  }, [])

  async function deleteCache() {
    caches.delete(`CACHE v${version}`)
    setCached(false)
  }

  function preloadFiles() {
    if (!preloading) {
      setPreloading(true)
      preloadingScene.current = new PreloadingScene(
        (pc) => {
          setPreloadingPc(pc * 100)
          setPreloadingMessage(
            preloadingScene.current?.loadingManager.statusMessage ?? ""
          )
        },
        () => {
          setPreloadingMessage(t("finished_preloading"))
          gameRef.current?.destroy(true)
          gameRef.current = null
          setCached(true)
          setPreloading(false)
        }
      )
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        scene: [preloadingScene.current],
        backgroundColor: "#000000"
      })
    }
  }

  return (
    <div id="game-files-tab">
      <p>
        {t("game_version")}: {version}
      </p>
      <p>
        {t("game_cached")}:{" "}
        <span style={{ color: cached ? "lime" : "red" }}>
          {cached ? t("yes") : t("no")}
        </span>
      </p>
      {!cached && !preloading && (
        <button className="bubbly blue" onClick={preloadFiles}>
          {t("download_game_files")}
        </button>
      )}
      {cached && !preloading && (
        <button className="bubbly red" onClick={deleteCache}>
          {t("delete_cache")}
        </button>
      )}
      {preloading && (
        <div>
          <progress
            className="my-progress"
            value={preloadingPc}
            max={100}
          ></progress>
          <p>{preloadingMessage}</p>
        </div>
      )}
    </div>
  )
}
