import React from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import WikiButton from "./wiki-button"
import WikiContent from "./wiki-content"
import WikiStatistic from "./wiki-statistic"
import WikiTypes from "./wiki-types"
import WikiFaq from "./wiki-faq"
import WikiItemsCheatSheet from "./wiki-items-cheat-sheet"

export default function Wiki(props: { toggleWiki: () => void }) {
  return (
    <div>
      <WikiButton toggleWiki={props.toggleWiki} />
      <div
        className="nes-container"
        style={{
          color: "white",
          margin: "10px",
          marginBottom: "30px",
          backgroundColor: "#54596b"
        }}
      >
        <Tabs>
          <TabList>
            <Tab key="title-faq">FAQ</Tab>
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
