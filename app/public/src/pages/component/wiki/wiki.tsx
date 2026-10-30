import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { LocalStoreKeys, localStore } from "../../utils/store"
import WikiAbility from "./wiki-ability"
import WikiData from "./wiki-data"
import WikiFaq from "./wiki-faq"
import WikiGlossary from "./wiki-glossary"
import WikiItems from "./wiki-items"
import WikiPokemons from "./wiki-pokemons"
import WikiRegions from "./wiki-regions"
import WikiStages from "./wiki-stages"
import WikiStatistic from "./wiki-statistic"
import WikiStatus from "./wiki-status"
import WikiTown from "./wiki-town"
import WikiTutorials from "./wiki-tutorials"
import WikiTypes from "./wiki-types"
import WikiWeather from "./wiki-weather"
import "./wiki.css"

export default function Wiki({ inGame = false }: { inGame: boolean }) {
  const { t } = useTranslation()
  const tabs = [
    ...(inGame
      ? []
      : [
          { key: "faq", label: t("wiki.faq.faq"), content: <WikiFaq /> },
          {
            key: "tutorials",
            label: t("wiki.nav.how_to_play"),
            content: <WikiTutorials />
          }
        ]),
    {
      key: "pokemon",
      label: t("wiki.nav.pokemons_label"),
      content: <WikiPokemons />
    },
    {
      key: "ability",
      label: t("wiki.nav.abilities_label"),
      content: <WikiAbility />
    },
    { key: "items", label: t("wiki.nav.items_label"), content: <WikiItems /> },
    {
      key: "types",
      label: t("wiki.nav.synergies_label"),
      content: <WikiTypes />
    },
    {
      key: "statistic",
      label: t("wiki.nav.statistics_label"),
      content: <WikiStatistic />
    },
    { key: "status", label: t("status_label"), content: <WikiStatus /> },
    {
      key: "weather",
      label: t("wiki.nav.weather_label"),
      content: <WikiWeather />
    },
    { key: "stages", label: t("stages"), content: <WikiStages /> },
    { key: "town", label: t("wiki.nav.town_label"), content: <WikiTown /> },
    {
      key: "dungeon",
      label: t("wiki.nav.dungeon_label"),
      content: <WikiRegions />
    },
    {
      key: "glossary",
      label: t("wiki.nav.glossary_label"),
      content: <WikiGlossary />
    },
    { key: "data", label: t("wiki.nav.data_label"), content: <WikiData /> }
  ]

  const lastTabOpened = localStore.get(LocalStoreKeys.LAST_TAB_OPENED_WIKI)
  const defaultIndex =
    lastTabOpened == null
      ? 0
      : Math.min(Math.max(lastTabOpened, 0), tabs.length - 1)

  return (
    <div id="wiki-page">
      <Tabs
        defaultIndex={defaultIndex}
        onSelect={(index) =>
          localStore.set(LocalStoreKeys.LAST_TAB_OPENED_WIKI, index)
        }
      >
        <TabList>
          {tabs.map((tab) => (
            <Tab key={tab.key}>{tab.label}</Tab>
          ))}
        </TabList>

        {tabs.map((tab) => (
          <TabPanel key={tab.key}>{tab.content}</TabPanel>
        ))}
      </Tabs>
    </div>
  )
}
