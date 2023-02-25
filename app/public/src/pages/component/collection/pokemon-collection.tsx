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

export default function PokemonCollection(props: {
  toggleCollection: () => void
}) {
  const metadata = tracker as unknown as { [key: string]: ITracker }
  const [selectedPokemon, setSelectedPokemon] = useState<Pkm | undefined>(undefined)

  const [filter, setFilter] = useState<string>("all")
  
  return (
    <div id="pokemon-collection">
      <header>
        <button
          onClick={() => {
            props.toggleCollection()
          }}
          className="bubbly blue"
        >
          Back to Lobby
        </button>
        <div className="spacer"></div>
        <button onClick={() => { setFilter("all") }} className="bubbly pink">
          <input type="checkbox" className="nes-checkbox is-dark" readOnly checked={filter === "all"}/><span>Show all</span>
        </button>
        <button onClick={() => { setFilter("locked") }} className="bubbly red">
          <input type="checkbox" className="nes-checkbox is-dark" readOnly checked={filter === "locked"}/><span>Show locked</span>
        </button>
        <button onClick={() => { setFilter("unlockable") }} className="bubbly orange">
          <input type="checkbox" className="nes-checkbox" readOnly checked={filter === "unlockable"}/><span>Show unlockable</span>
        </button>
        <button onClick={() => { setFilter("unlocked") }} className="bubbly green">
          <input type="checkbox" className="nes-checkbox is-dark" readOnly checked={filter === "unlocked"}/><span>Show unlocked</span>
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
              <img src="assets/unown/unown-qm.png" alt="?" className="unown-icon" />
            </Tab>
          </TabList>

          {(["all"].concat(Object.keys(Synergy)) as (Synergy | "all")[]).map(type => {
            return (
              <TabPanel key={type}>                
                <PokemonCarousel
                  type={type}
                  setPokemon={setSelectedPokemon}
                  metadata={metadata}
                  filter={filter}
                />
              </TabPanel>
            )
          })}
          <TabPanel>
            <UnownPanel setPokemon={setSelectedPokemon} metadata={metadata} filter={filter} />
          </TabPanel>
        </Tabs>
      </div>
      {selectedPokemon && <PokemonEmotionsModal pokemon={selectedPokemon} onHide={() => {
          setSelectedPokemon(undefined)
      }}/>}
    </div>
  )
}
