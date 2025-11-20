import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Emotion, PkmWithCustom } from "../../../../../types"
import { Item } from "../../../../../types/enum/Item"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { ITierList } from "../../../../../types/interfaces/TierList"
import { exportElementAsImage } from "../../../../../utils/export-image"
import { LocalStoreKeys, localStore } from "../../utils/store"
import ItemPicker from "../bot-builder/item-picker"
import PokemonPicker from "../bot-builder/pokemon-picker"
import TierList from "./tier-list"
import "./tier-list-maker.css"

export default function TierListMaker() {
  const { t } = useTranslation()

  function getInitialTierList(): ITierList {
    return {
      name: t("tier_list.title"),
      rows: [
        { name: "S", color: "#ff7f7f", items: [] },
        { name: "A", color: "#ffbf7f", items: [] },
        { name: "B", color: "#FFDF7F", items: [] },
        { name: "C", color: "#FFFF7F", items: [] },
        { name: "D", color: "#BFFF7F", items: [] }
      ]
    }
  }
  const [selection, setSelection] = useState<Item | PkmWithCustom>({
    name: Pkm.MAGIKARP,
    shiny: false,
    emotion: Emotion.NORMAL
  })

  const [tierList, setTierList] = useState<ITierList>(
    localStore.get(LocalStoreKeys.TIER_LIST) ?? getInitialTierList()
  )
  useEffect(() => {
    localStore.set(LocalStoreKeys.TIER_LIST, tierList)
  }, [tierList])

  function saveFile() {
    const blob = new Blob([JSON.stringify(tierList)], {
      type: "application/json"
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "tierlist.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  function loadFile() {
    // load from local JSON file
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.addEventListener("change", async (e) => {
      if (!input.files) return
      const file = input.files![0]
      const reader = new FileReader()
      reader.onload = async (e) => {
        if (!e.target) return
        try {
          const data = JSON.parse(e.target.result as string)
          if (!data) {
            throw new Error("Invalid file content")
          } else {
            setTierList({ ...data })
          }
        } catch (e) {
          alert("Invalid file")
        }
      }
      reader.readAsText(file)
    })
    input.click()
  }

  async function downloadImage() {
    try {
      await exportElementAsImage({
        selector: ".tier-list-table",
        excludeSelector: ".tier-list-actions-column",
        filename: tierList.name,
        preferClipboard: false
      })
    } catch (error) {
      alert("Failed to capture tier list image")
    }
  }

  async function shareOnDiscord() {
    try {
      // First copy the image to clipboard
      await exportElementAsImage({
        selector: ".tier-list-table",
        excludeSelector: ".tier-list-actions-column",
        filename: tierList.name,
        preferClipboard: true
      })

      // Open Discord channel in new tab
      const discordChannelUrl =
        "https://discord.com/channels/737230355039387749/1126145783889145887"
      window.open(discordChannelUrl, "_blank")
    } catch (error) {
      console.error("Error sharing to Discord:", error)
      alert("Failed to prepare tier list for Discord sharing")
    }
  }

  function reset() {
    setTierList(getInitialTierList())
  }

  function addRow() {
    const newRows = [
      ...tierList.rows,
      {
        name: `Tier ${tierList.rows.length + 1}`,
        color: "#7f7f7f", // Default gray color for new rows
        items: []
      }
    ]
    setTierList({ ...tierList, rows: newRows })
  }

  return (
    <div id="tier-list-maker">
      <div className="actions">
        <button
          className="bubbly dark tier-list-add-row"
          onClick={addRow}
          type="button"
        >
          ＋{t("tier_list.add_row")}
        </button>
        <button className="bubbly dark" onClick={loadFile}>
          <img src="assets/ui/load.svg" /> {t("load")}
        </button>
        <button className="bubbly dark" onClick={saveFile}>
          <img src="assets/ui/save.svg" /> {t("save")}
        </button>
        <button className="bubbly blue" onClick={downloadImage}>
          <img src="assets/ui/save.svg" /> {t("tier_list.download_image")}
        </button>
        <button className="bubbly blue" onClick={shareOnDiscord}>
          <img src="assets/ui/share.svg" /> {t("tier_list.share_on_discord")}
        </button>
        <button className="bubbly red" onClick={reset}>
          <img src="assets/ui/trash.svg" /> {t("reset")}
        </button>
      </div>
      <TierList tierList={tierList} onUpdate={setTierList} />
      <ItemPicker />
      <PokemonPicker />
    </div>
  )
}
