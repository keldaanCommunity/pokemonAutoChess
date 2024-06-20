import { t } from "i18next"
import React, { memo, useMemo, useState } from "react"
import WikiAbility from "./wiki-ability"
import { WikiDungeon } from "./wiki-dungeon"
import WikiFaq from "./wiki-faq"
import WikiItems from "./wiki-items"
import WikiStatistic from "./wiki-statistic"
import WikiStatus from "./wiki-status"
import WikiTutorials from "./wiki-tutorials"
import WikiTypes from "./wiki-types"
import WikiWeather from "./wiki-weather"

import "./wiki-panel.css"
import { WikiPanelPokemon } from "./wiki-panel-pokemon"

const PAGES = [
  {
    displayName: "faq.faq",
    Component: WikiFaq,
    showInGame: false,
  },
  {
    displayName: "how_to_play",
    Component: WikiTutorials,
    showInGame: false,
  },
  {
    displayName: "pokemons_label",
    Component: WikiPanelPokemon,
    showInGame: true,
  },
  {
    displayName: "abilities_label",
    Component: WikiAbility,
    showInGame: true,
  },
  {
    displayName: "items_label",
    Component: WikiItems,
    showInGame: true,
  },
  {
    displayName: "synergies_label",
    Component: WikiTypes,
    showInGame: true,
  },
  {
    displayName: "statistics_label",
    Component: WikiStatistic,
    showInGame: true,
  },
  {
    displayName: "status_label",
    Component: WikiStatus,
    showInGame: true,
  },
  {
    displayName: "weather_label",
    Component: WikiWeather,
    showInGame: true,
  },
  {
    displayName: "dungeon_label",
    Component: WikiDungeon,
    showInGame: true,
  },
]

export const WikiPanel = memo(({ inGame }: { inGame: boolean }) => {
  const validPages = useMemo(
    () => PAGES.filter((page) => !inGame || page.showInGame),
    [inGame]
  )
  const [tabIndex, setTabIndex] = useState(0)

  const Component = validPages[tabIndex].Component

  return (
    <div className="wiki-panel">
      <select
        className="wiki-page-select"
        onChange={(e) => setTabIndex(Number(e.currentTarget.value))}
      >
        {validPages.map((page, index) => (
          <option key={index} value={index}>
            {t(page.displayName)}
          </option>
        ))}
      </select>
      <div className="wiki-content">
        <Component />
      </div>
    </div>
  )
})
