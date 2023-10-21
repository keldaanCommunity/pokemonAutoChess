import React, { useState } from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import PokemonCarousel from "./pokemon-carousel"
import { Synergy } from "../../../../../types/enum/Synergy"
import { Pkm } from "../../../../../types/enum/Pokemon"
import SynergyIcon from "../icons/synergy-icon"
import PokemonEmotionsModal from "./pokemon-emotions-modal"
import UnownPanel from "./unown-panel"
import "./pokemon-collection.css"
import { useTranslation } from "react-i18next"
import { Checkbox } from "../checkbox/checkbox"

export default function PokemonCollection() {
  const { t } = useTranslation()  
  const [selectedPokemon, setSelectedPokemon] = useState<Pkm | undefined>(
    undefined
  )

  const [filter, setFilter] = useState<string>("all")
  const [shinyOnly, setShinyOnly] = useState<boolean>(false)

  return (
    <div id="pokemon-collection">
      <header className="nes-container">
        <Checkbox
          checked={shinyOnly}
          onToggle={setShinyOnly}
          label={t("shiny_hunter")}
          isDark
        />
        <button
          onClick={() => {
            setFilter("all")
          }}
          className="bubbly pink"
        >
          <Checkbox
            checked={filter === "all"}
            label={t("show_all")}
            isDark
            readOnly
          />
        </button>
        <button
          onClick={() => {
            setFilter("locked")
          }}
          className="bubbly red"
        >
          <Checkbox
            checked={filter === "locked"}
            label={t("show_locked")}
            isDark
            readOnly
          />
        </button>
        <button
          onClick={() => {
            setFilter("unlockable")
          }}
          className="bubbly orange"
        >
          <Checkbox
            checked={filter === "unlockable"}
            label={t("show_unlockable")}
            readOnly
          />
        </button>
        <button
          onClick={() => {
            setFilter("unlocked")
          }}
          className="bubbly green"
        >
          <Checkbox
            checked={filter === "unlocked"}
            label={t("show_unlocked")}
            isDark
            readOnly
          />
        </button>
      </header>
      <div className="nes-container">
        <Tabs>
          <TabList className="pokemon-collection-tabs">
            <Tab key="title-all">{t("ALL")}</Tab>
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
