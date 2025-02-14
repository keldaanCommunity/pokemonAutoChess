import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { DungeonMusic } from "../../../../../types/enum/Dungeon"
import { usePreference } from "../../../preferences"
import { getGameScene } from "../../game"
import { playMusic, preloadMusic } from "../../utils/audio"
import { cc } from "../../utils/jsx"
import { Modal } from "../modal/modal"

import "./jukebox.css"

export default function Jukebox(props: {
  show: boolean
  handleClose: Dispatch<SetStateAction<void>>
}) {
  const { t } = useTranslation()

  const MUSICS: DungeonMusic[] = Object.values(DungeonMusic)

  const musicPlaying = getGameScene()?.music?.key?.replace(
    "music_",
    ""
  ) as DungeonMusic
  const [music, setMusic] = useState<DungeonMusic>(musicPlaying)
  const [loading, setLoading] = useState<boolean>(false)
  const [volume, setVolume] = usePreference("musicVolume")

  useEffect(() => {
    if (musicPlaying !== music && !loading) {
      setMusic(musicPlaying)
    }
  }, [music, musicPlaying, loading])

  function changeMusic(name: DungeonMusic) {
    setMusic(name)
    const gameScene = getGameScene()
    if (gameScene) {
      gameScene.music?.destroy()
      setLoading(true)
      const alreadyLoading = gameScene.load.isLoading()
      if (!alreadyLoading) {
        gameScene.load.reset()
      }
      preloadMusic(gameScene, name)
      gameScene.load.once("complete", () => {
        playMusic(gameScene, name)
        setLoading(false)
      })
      if (!alreadyLoading) {
        gameScene.load.start()
      }
    }
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newVolume = Number(e.target.value)
    setVolume(newVolume)
  }

  function nextMusic(delta: number) {
    const newIndex =
      (MUSICS.indexOf(music) + MUSICS.length + delta) % MUSICS.length
    changeMusic(MUSICS[newIndex])
  }

  return (
    <Modal show={props.show} onClose={props.handleClose}
      className="game-jukebox-modal"
      header={t("jukebox")}
    >
      <div className="actions" style={{ marginBottom: "0.5em" }}>
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
      </div>

      <select
        value={music}
        onChange={(e) => changeMusic(e.target.value as DungeonMusic)}
        className="is-light"
      >
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
    </Modal>
  )
}
