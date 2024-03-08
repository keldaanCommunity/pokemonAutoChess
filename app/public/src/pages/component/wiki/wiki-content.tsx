import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { RarityColor } from "../../../../../types/Config"
import { Rarity } from "../../../../../types/enum/Game"
import WikiPokemon from "./wiki-pokemon"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"
import { getPokemonData } from "../../../../../models/precomputed"
import { Pkm } from "../../../../../types/enum/Pokemon"

export default function WikiContent() {
  const { t } = useTranslation()
  const tabs = Object.values(Rarity) as Rarity[]
  const [selectedPkm, setSelectedPkm] = useState<Pkm | "">("")
  const [tabIndex, setTabIndex] = useState(0)
  useEffect(() => {
    if (selectedPkm) {
      setTabIndex(tabs.indexOf(getPokemonData(selectedPkm).rarity))
    }
  }, [selectedPkm])

  return (
    <Tabs
      className="wiki-pokemons"
      selectedIndex={tabIndex}
      onSelect={(index) => setTabIndex(index)}
    >
      <PokemonTypeahead
        value={selectedPkm ?? ""}
        onChange={(pkm) => {
          if (pkm) {
            setSelectedPkm(pkm)
          }
        }}
      />
      <TabList>
        {tabs.map((r) => {
          return (
            <Tab key={"title-" + r} style={{ color: RarityColor[Rarity[r]] }}>
              {t("rarity." + r).toUpperCase()}
            </Tab>
          )
        })}
      </TabList>

      {(Object.values(Rarity) as Rarity[]).map((r) => {
        return (
          <TabPanel key={r}>
            <WikiPokemon
              rarity={r}
              selected={selectedPkm}
              onSelect={setSelectedPkm}
            />
          </TabPanel>
        )
      })}
    </Tabs>
  )
}
