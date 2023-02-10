import React from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import WikiContent from "./wiki-content"
import WikiStatistic from "./wiki-statistic"
import WikiTypes from "./wiki-types"
import WikiFaq from "./wiki-faq"
import WikiItemsCheatSheet from "./wiki-items-cheat-sheet"
import "./wiki.css"

export default function Wiki(props: { toggleWiki: () => void }) {
  return (
    <div id="wiki-page">
      <button
        onClick={props.toggleWiki}
        className="bubbly blue"
      >Back to Lobby</button>

      <div className="nes-container">
        <Tabs>
          <TabList>
            <Tab key="title-faq">F.A.Q.</Tab>
            <Tab key="title-pokemon">POKEMONS</Tab>
            <Tab key="title-items">ITEMS</Tab>
            <Tab key="title-types">SYNERGIES</Tab>
            <Tab key="title-statistic">STATISTICS</Tab>
          </TabList>

          <TabPanel key="faq">
            <WikiFaq />
          </TabPanel>
          <TabPanel key="pokemon">
            <WikiContent />
          </TabPanel>
          <TabPanel key="items">
            <WikiItemsCheatSheet />
          </TabPanel>
          <TabPanel key="types">
            <WikiTypes />
          </TabPanel>
          <TabPanel key="statistic">
            <WikiStatistic />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  )
}
