import React, { Dispatch, SetStateAction, useState } from "react"
import { Modal } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { Dungeon } from "../../../../../types/Config"
import { getPreferences, savePreferences } from "../../../preferences"
import { getGameScene } from "../../game"
import { playMusic } from "../../utils/audio"
import { cc } from "../../utils/jsx"

import "./jukebox.css"

export default function Jukebox(props: {
  show: boolean
  handleClose: Dispatch<SetStateAction<void>>
}) {
  const { t } = useTranslation()

  const MUSICS: string[] = Object.values(Dungeon)

  const [music, setMusic] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(getPreferences().musicVolume)

  function changeMusic(name: string) {
    setMusic(name)
    const gameScene = getGameScene()
    if (gameScene) {
      gameScene.music?.destroy()
      setLoading(true)
      gameScene.load.reset()
      gameScene.load.audio("music_" + name, [
        `https://raw.githubusercontent.com/keldaanCommunity/pokemonAutoChessMusic/main/music/${name}.mp3`
      ])
      gameScene.load.once("complete", () => {
        playMusic(gameScene, name)
        setLoading(false)
      })
      gameScene.load.start()
    }
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newVolume = Number(e.target.value)
    setVolume(newVolume)
    savePreferences({ musicVolume: newVolume })
    const gameScene = getGameScene()
    if (gameScene && gameScene.music) {
      gameScene.music.setVolume(newVolume / 100)
    }
  }

  function nextMusic(delta: number) {
    const newIndex =
      (MUSICS.indexOf(music) + MUSICS.length + delta) % MUSICS.length
    changeMusic(MUSICS[newIndex])
  }

  return (
    <Modal show={props.show} onHide={props.handleClose} width={800}>
      <Modal.Header>
        <Modal.Title>{t("jukebox")}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="game-jukebox-modal-body">
        <p className="actions">
          <button className="bubbly blue" onClick={() => nextMusic(-1)}>
            ◄
          </button>
          <div className={cc("compact-disc", { loading })}>
            <img src="/assets/ui/compact-disc.svg" />
            <span>{loading && t("loading")}</span>
          </div>
          <button className="bubbly blue" onClick={() => nextMusic(+1)}>
            ►
          </button>
        </p>

        <select value={music} onChange={(e) => changeMusic(e.target.value)}>
          {MUSICS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <p>
          <label className="full-width">
            {t("music_volume")}: {volume} %
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onInput={handleVolumeChange}
            ></input>
          </label>
        </p>
      </Modal.Body>
    </Modal>
  )
}
