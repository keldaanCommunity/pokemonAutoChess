import React from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { RarityColor } from "../../../../../types/Config"
import { Rarity } from "../../../../../types/enum/Game"
import WikiPokemon from "./wiki-pokemon"

export default function WikiContent() {
  return (
    <Tabs>
      <TabList>
        {(Object.values(Rarity) as Rarity[]).map((r) => {
          return (
            <Tab key={"title-" + r} style={{ color: RarityColor[Rarity[r]] }}>
              {r}
            </Tab>
          )
        })}
      </TabList>

      {(Object.values(Rarity) as Rarity[]).map((r) => {
        return (
          <TabPanel key={r}>
            <WikiPokemon rarity={r} />
          </TabPanel>
        )
      })}
    </Tabs>
  )
}
