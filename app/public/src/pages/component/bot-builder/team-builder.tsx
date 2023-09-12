import React, { useEffect, useMemo, useState } from "react"
import { Item } from "../../../../../types/enum/Item"
import { Pkm } from "../../../../../types/enum/Pokemon"
import PokemonFactory from "../../../../../models/pokemon-factory"
import SelectedEntity from "./selected-entity"
import ItemPicker from "./item-picker"
import PokemonPicker from "./pokemon-picker"
import TeamEditor from "./team-editor"
import {
  IBot,
  IDetailledPokemon
} from "../../../../../models/mongo-models/bot-v2"
import { Synergy } from "../../../../../types/enum/Synergy"
import { PkmWithConfig, Emotion } from "../../../../../types"
import Synergies from "../synergy/synergies"
import "./team-builder.css"
import { computeSynergies } from "../../../../../models/colyseus-models/synergies"
import BotAvatar from "./bot-avatar"

export default function TeamBuilder(props: {
  bot?: IBot
  onChangeAvatar?: (pkm: PkmWithConfig) => void
  board: IDetailledPokemon[]
  updateBoard: (board: IDetailledPokemon[]) => void
  error?: string
}) {
  const [selection, setSelection] = useState<Item | PkmWithConfig>({
    name: Pkm.MAGIKARP,
    shiny: false,
    emotion: Emotion.NORMAL
  })

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
          selectedEmotion: p.emotion,
          selectedShiny: p.shiny
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

  function addPokemon(x: number, y: number, pkm: PkmWithConfig) {
    const i = board.findIndex((p) => p.x === x && p.y === y)
    if (i >= 0) board.splice(i, 1)
    const newPokemon: IDetailledPokemon = { ...pkm, x, y, items: [] }
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
    } else if (Object.values(Pkm).includes((selection as PkmWithConfig).name)) {
      addPokemon(x, y, selection as PkmWithConfig)
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
      const pkm: PkmWithConfig = {
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

  function updateSelectedPokemon(pkm: PkmWithConfig) {
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
      Object.values(Pkm).includes((selection as PkmWithConfig).name)
    ) {
      props.onChangeAvatar(selection as PkmWithConfig)
    }
  }

  return (
    <div id="team-builder" className="nes-container">
      <Synergies synergies={synergies} />
      <TeamEditor
        board={board}
        handleEditorClick={handleEditorClick}
        handleDrop={handleDrop}
      />
      <SelectedEntity entity={selection} onChange={updateSelectedPokemon} />
      <ItemPicker selectEntity={setSelection} />
      <PokemonPicker selectEntity={setSelection} />
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
