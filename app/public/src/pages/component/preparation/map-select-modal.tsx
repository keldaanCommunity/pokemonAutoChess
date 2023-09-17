import React from "react"
import { useTranslation } from "react-i18next"
import { Dungeon } from "../../../../../types/Config"
import { BasicModal } from "../modal/modal"
import "./map-select-modal.css"

export function MapSelectModal(props: {
  show: boolean
  handleClose: () => void
}) {
  const { t } = useTranslation()
  const maps = Object.keys(Dungeon).sort((a, b) =>
    (t("map." + a) as string).localeCompare(t("map." + b))
  )

  function selectMap(map: string | undefined) {
    props.handleClose()
  }

  return (
    <BasicModal
      title={t("select_map")}
      show={props.show}
      handleClose={() => props.handleClose()}
      body={
        <ul id="map-select-modal" className="nes-container">
          <li>
              <img
                src="/assets/maps/random.png"
                alt="random"
                onClick={() => selectMap(undefined)}
              />
              <span>{t("map.random")}</span>
          </li>
          {maps.map((m) => (
            <li key={m}>
              <img
                src={`/assets/maps/${m}.png`}
                alt={m}
                onClick={() => selectMap(m)}
              />
              <span>{t("map." + m)}</span>
            </li>
          ))}
        </ul>
      }
    />
  )
}
