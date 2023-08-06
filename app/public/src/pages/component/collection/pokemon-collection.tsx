import React, { useState } from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import PokemonCarousel from "./pokemon-carousel"
import tracker from "../../../../dist/client/assets/pokemons/tracker.json"
import { Synergy } from "../../../../../types/enum/Synergy"
import { ITracker } from "../../../../../types/ITracker"
import { Pkm } from "../../../../../types/enum/Pokemon"
import SynergyIcon from "../icons/synergy-icon"
import PokemonEmotionsModal from "./pokemon-emotions-modal"
import UnownPanel from "./unown-panel"
import "./pokemon-collection.css"
import { t } from "i18next"

export default function PokemonCollection() {
  const metadata = tracker as unknown as { [key: string]: ITracker }
  const [selectedPokemon, setSelectedPokemon] = useState<Pkm | undefined>(
    undefined
  )

  const [filter, setFilter] = useState<string>("all")
  const [shinyOnly, setShinyOnly] = useState<boolean>(false)

  return (
    <div id="pokemon-collection">
      <header>
        <label>
          <input
            type="checkbox"
            className="nes-checkbox is-dark"
            checked={shinyOnly === true}
            onChange={(e) => setShinyOnly(!shinyOnly)}
          />
          <span>{t("shiny_hunter")}</span>
        </label>
        <button
          onClick={() => {
            setFilter("all")
          }}
          className="bubbly pink"
        >
          <input
            type="checkbox"
            className="nes-checkbox is-dark"
            readOnly
            checked={filter === "all"}
          />
          <span>{t("show_all")}</span>
        </button>
        <button
          onClick={() => {
            setFilter("locked")
          }}
          className="bubbly red"
        >
          <input
            type="checkbox"
            className="nes-checkbox is-dark"
            readOnly
            checked={filter === "locked"}
          />
          <span>{t("show_locked")}</span>
        </button>
        <button
          onClick={() => {
            setFilter("unlockable")
          }}
          className="bubbly orange"
        >
          <input
            type="checkbox"
            className="nes-checkbox"
            readOnly
            checked={filter === "unlockable"}
          />
          <span>{t("show_unlockable")}</span>
        </button>
        <button
          onClick={() => {
            setFilter("unlocked")
          }}
          className="bubbly green"
        >
          <input
            type="checkbox"
            className="nes-checkbox is-dark"
            readOnly
            checked={filter === "unlocked"}
          />
          <span>{t("show_unlocked")}</span>
        </button>
      </header>
      <div className="nes-container">
        <Tabs>
          <TabList>
            <Tab key="title-all">ALL</Tab>
            {(Object.keys(Synergy) as Synergy[]).map((type) => {
              return (
                <Tab key={"title-" + type}>
                  <SynergyIcon type={type} />
                </Tab>
              )
            })}
            <Tab key="?">
              <img
                src="assets/unown/unown-qm.png"
                alt="?"
                className="unown-icon"
              />
            </Tab>
          </TabList>

          {(["all"].concat(Object.keys(Synergy)) as (Synergy | "all")[]).map(
            (type) => {
              return (
                <TabPanel key={type}>
                  <PokemonCarousel
                    type={type}
                    setPokemon={setSelectedPokemon}
                    metadata={metadata}
                    filter={filter}
                    shinyOnly={shinyOnly}
                  />
                </TabPanel>
              )
            }
          )}
          <TabPanel>
            <UnownPanel
              setPokemon={setSelectedPokemon}
              metadata={metadata}
              filter={filter}
            />
          </TabPanel>
        </Tabs>
      </div>
      {selectedPokemon && (
        <PokemonEmotionsModal
          pokemon={selectedPokemon}
          onHide={() => {
            setSelectedPokemon(undefined)
          }}
        />
      )}
    </div>
  )
}
