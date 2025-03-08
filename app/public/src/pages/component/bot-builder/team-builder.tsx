import React, { useEffect, useMemo, useState } from "react"
import { computeSynergies } from "../../../../../models/colyseus-models/synergies"
import {
  IBot,
  IDetailledPokemon
} from "../../../../../models/mongo-models/bot-v2"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { Emotion, PkmWithCustom } from "../../../../../types"
import { Item } from "../../../../../types/enum/Item"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import Synergies from "../synergy/synergies"
import BotAvatar from "./bot-avatar"
import ItemPicker from "./item-picker"
import PokemonPicker from "./pokemon-picker"
import SelectedEntity from "./selected-entity"
import TeamEditor from "./team-editor"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import { selectCurrentPlayer, useAppSelector } from "../../../hooks"
import { values } from "../../../../../utils/schemas"
import { isOnBench } from "../../../../../utils/board"
import "./team-builder.css"

export default function TeamBuilder(props: {
  bot?: IBot
  onChangeAvatar?: (pkm: PkmWithCustom) => void
  board: IDetailledPokemon[]
  updateBoard: (board: IDetailledPokemon[]) => void
  error?: string
}) {
  const { t } = useTranslation()
  const [selection, setSelection] = useState<Item | PkmWithCustom>({
    name: Pkm.MAGIKARP,
    shiny: false,
    emotion: Emotion.NORMAL
  })

  const ingame = useLocation().pathname === "/game"
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const [board, setBoard] = useState<IDetailledPokemon[]>(props.board ?? [])


  useEffect(() => {
    if (props.board) setBoard(props.board) // keep local state in sync with parent prop
  }, [props.board])

  function updateBoard(board) {
    if (props.updateBoard) props.updateBoard(board)
    else setBoard(board)
  }

  const [selectedPokemon, setSelectedPokemon] = useState<IDetailledPokemon>()

  const synergies: [Synergy, number][] = useMemo(() => {
    const map = computeSynergies(
      board.map((p) => {
        const pkm = PokemonFactory.createPokemonFromName(p.name, {
          emotion: p.emotion,
          shiny: p.shiny
        })
        pkm.positionX = p.x
        pkm.positionY = p.y
        p.items.forEach((item) => {
          pkm.items.add(item)
        })
        return pkm
      })
    )
    return [...map.entries()]
  }, [board])

  function addPokemon(x: number, y: number, pkm: PkmWithCustom) {
    let existingItems
    const i = board.findIndex((p) => p.x === x && p.y === y)
    if (i >= 0) {
      existingItems = board[i].items
      board.splice(i, 1)
    }
    const newPokemon: IDetailledPokemon = {
      ...pkm,
      x,
      y,
      items: existingItems ?? []
    }
    setSelectedPokemon(newPokemon)
    updateBoard([...board, newPokemon])
  }

  function addItem(x: number, y: number, item: Item) {
    const p = board.find((p) => p.x === x && p.y === y)
    if (p && p.items.length < 3) {
      p.items.push(item)
    } else if (p && p.items.length >= 3) {
      p.items = [item]
    }
    updateBoard([...board])
  }

  function handleEditorClick(
    x: number,
    y: number,
    rightClick: boolean,
    itemIndex?: number
  ) {
    const pokemonOnCell = board.find((p) => p.x === x && p.y === y)
    if (rightClick) {
      if (itemIndex !== undefined) {
        // remove item
        pokemonOnCell?.items.splice(itemIndex, 1)
        updateBoard([...board])
      } else {
        // remove pokemon
        updateBoard(board.filter((p) => p !== pokemonOnCell))
        if (
          selectedPokemon &&
          selectedPokemon.x === x &&
          selectedPokemon.y === y
        ) {
          setSelectedPokemon(undefined)
        }
      }
    } else if (pokemonOnCell) {
      setSelection(pokemonOnCell)
      setSelectedPokemon(pokemonOnCell)
    } else if (Object.values(Pkm).includes((selection as PkmWithCustom).name)) {
      addPokemon(x, y, selection as PkmWithCustom)
    } else if (Object.keys(Item).includes(selection as Item)) {
      addItem(x, y, selection as Item)
    }
  }

  function handleDrop(x: number, y: number, e: React.DragEvent) {
    if (e.dataTransfer.getData("cell") != "") {
      const [originX, originY] = e.dataTransfer
        .getData("cell")
        .split(",")
        .map(Number)
      const pkm = board.find((p) => p.x === originX && p.y === originY)
      const otherPokemonOnCell = board.find((p) => p.x === x && p.y === y)
      if (pkm) {
        if (otherPokemonOnCell) {
          otherPokemonOnCell.x = originX
          otherPokemonOnCell.y = originY
        }
        pkm.x = x
        pkm.y = y
        updateBoard([...board])
      }
    } else if (e.dataTransfer.getData("pokemon") != "") {
      const pkm: PkmWithCustom = {
        name: e.dataTransfer.getData("pokemon") as Pkm,
        emotion: Emotion.NORMAL,
        shiny: false
      }
      addPokemon(x, y, pkm)
      setSelection(pkm)
    } else if (e.dataTransfer.getData("item") != "") {
      const item = e.dataTransfer.getData("item") as Item
      addItem(x, y, item)
      setSelection(item)
    }
  }

  function getFirstEmptyCell(): { x: number; y: number } | null {
    for (let y = 1; y < 3; y++) {
      for (let x = 0; x < 8; x++) {
        if (board.find(p => p.x === x && p.y === y) === undefined) {
          return { x, y }
        }
      }
    }
    return null
  }

  function addPokemonOnFirstEmptyCell(entity: PkmWithCustom) {
    const firstEmptyCell = getFirstEmptyCell()
    if (firstEmptyCell) {
      addPokemon(firstEmptyCell.x, firstEmptyCell.y, entity)
    }
  }

  function updateSelectedPokemon(pkm: PkmWithCustom) {
    setSelection(pkm)
    if (selectedPokemon != null) {
      selectedPokemon.emotion = pkm.emotion
      selectedPokemon.shiny = pkm.shiny
      updateBoard([...board])
    }
  }

  function changeAvatar() {
    if (
      selection &&
      props.onChangeAvatar &&
      Object.values(Pkm).includes((selection as PkmWithCustom).name)
    ) {
      props.onChangeAvatar(selection as PkmWithCustom)
    }
  }

  function snapshot() {
    try {
      if (!currentPlayer) return;
      updateBoard(values(currentPlayer.board).filter(pokemon => !isOnBench(pokemon)).map(p => {
        return {
          name: p.name,
          emotion: p.emotion,
          shiny: p.shiny,
          items: values(p.items),
          x: p.positionX,
          y: p.positionY
        }
      }))
    } catch (e) {
      console.error("Failed to snapshot board:", e)
    }
  }

  function reset() {
    updateBoard([])
  }

  function saveFile() {
    // save board to local JSON file    
    const blob = new Blob([JSON.stringify(board)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "board.json"
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
        const data = JSON.parse(e.target.result as string)
        if (data.length == 0) {
          alert("Invalid file")
        } else {
          updateBoard(data)
        }
      }
      reader.readAsText(file)
    })
    input.click()
  }

  return (
    <div id="team-builder">
      <Synergies synergies={synergies} tooltipPortal={false} />
      <div className="actions">
        {ingame && <button className="bubbly blue" onClick={snapshot}><img src="assets/ui/photo.svg" /> {t("snapshot")}</button>}
        <button className="bubbly dark" onClick={saveFile}><img src="assets/ui/save.svg" /> {t("save")}</button>
        <button className="bubbly dark" onClick={loadFile}><img src="assets/ui/load.svg" /> {t("load")}</button>
        <button className="bubbly red" onClick={reset}><img src="assets/ui/trash.svg" /> {t("reset")}</button>
      </div>
      <TeamEditor
        board={board}
        handleEditorClick={handleEditorClick}
        handleDrop={handleDrop}
      />
      <SelectedEntity entity={selection} onChange={updateSelectedPokemon} />
      <ItemPicker selectEntity={setSelection} selected={selection} />
      <PokemonPicker selectEntity={e => setSelection(e as PkmWithCustom | Item)} addEntity={addPokemonOnFirstEmptyCell} selected={selection} />
      {props.bot && props.onChangeAvatar && (
        <BotAvatar
          bot={props.bot}
          onChangeAvatar={props.onChangeAvatar}
          onClick={changeAvatar}
        />
      )}
      {props.error && <p className="error">{props.error}</p>}
    </div>
  )
}
