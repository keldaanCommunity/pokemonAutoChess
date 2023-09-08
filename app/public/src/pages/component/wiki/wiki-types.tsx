import React from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import WikiType from "./wiki-type"
import { Synergy } from "../../../../../types/enum/Synergy"
import SynergyIcon from "../icons/synergy-icon"
import { useTranslation } from "react-i18next"

export default function WikiTypes() {
  const { t } = useTranslation()
  return (
    <Tabs className="synergies-tabs">
      <TabList>
        {(Object.keys(Synergy) as Synergy[]).map((type) => {
          return (
            <Tab key={"title-" + type}>
              <SynergyIcon type={type} />
            </Tab>
          )
        })}
        <Tab key="title-all">{t("ALL")}</Tab>
      </TabList>

      {(Object.keys(Synergy) as Synergy[]).map((r) => {
        return (
          <TabPanel key={r}>
            <WikiType type={r} />
          </TabPanel>
        )
      })}
      <TabPanel key="all">
        <WikiType type="all" />
      </TabPanel>
    </Tabs>
  )
}
