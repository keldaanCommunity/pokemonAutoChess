import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { Checkbox } from "../checkbox/checkbox"
import SynergyIcon from "../icons/synergy-icon"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"
import PokemonCarousel from "./pokemon-carousel"
import "./pokemon-collection.css"
import PokemonEmotionsModal from "./pokemon-emotions-modal"
import UnownPanel from "./unown-panel"

export default function PokemonCollection() {
  const { t } = useTranslation()
  const [selectedPokemon, setSelectedPokemon] = useState<Pkm | undefined>(
    undefined
  )

  const [filter, setFilter] = useState<string>("all")
  const [sort, setSort] = useState<string>("index")
  const [shinyOnly, setShinyOnly] = useState<boolean>(false)

  return (
    <div id="pokemon-collection">
      <header className="nes-container">
        <PokemonTypeahead
          value={selectedPokemon ?? ""}
          onChange={(pkm) => {
            if (pkm) {
              setSelectedPokemon(pkm)
            }
          }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="my-select"
        >
          <option value={"all"}>{t("show_all")}</option>
          <option value={"locked"}>{t("show_locked")}</option>
          <option value={"unlockable"}>{t("show_unlockable")}</option>
          <option value={"unlocked"}>{t("show_unlocked")}</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="my-select"
        >
          <option value={"index"}>{t("sort_by_index")}</option>
          <option value={"shards"}>{t("sort_by_shards")}</option>
        </select>

        <Checkbox
          checked={shinyOnly}
          onToggle={setShinyOnly}
          label={t("shiny_hunter")}
          isDark
        />
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
                    sort={sort}
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
              sort={sort}
              shinyOnly={shinyOnly}
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
