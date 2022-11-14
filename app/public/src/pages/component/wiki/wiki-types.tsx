import React from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import WikiType from "./wiki-type"
import { Synergy } from "../../../../../types/enum/Synergy"

export default function WikiTypes() {
  return (
    <Tabs>
      <TabList>
        {(Object.keys(Synergy) as Synergy[]).map((r) => {
          // console.log('synergies', r)
          return (
            <Tab key={"title-" + r}>
              {" "}
              <img src={"assets/types/" + r + ".png"}></img>
            </Tab>
          )
        })}
      </TabList>

      {(Object.keys(Synergy) as Synergy[]).map((r) => {
        return (
          <TabPanel key={r}>
            <WikiType type={r} />
          </TabPanel>
        )
      })}
    </Tabs>
  )
}
