import React, { useState } from "react"
import { Item } from "../../../../../types/enum/Item"
import { Pkm, PkmFamily } from "../../../../../types/enum/Pokemon"
import PokemonFactory from "../../../../../models/pokemon-factory"
import SelectedEntity from "./selected-entity"
import ModalMenu from "./modal-menu"
import ItemPicker from "./item-picker"
import PokemonPicker from "./pokemon-picker"
import TeamEditor from "./team-editor"
import ReactTooltip from "react-tooltip"
import { IBot, IStep } from "../../../../../models/mongo-models/bot-v2"
import CSS from "csstype"
import produce from "immer"
import { useAppSelector, useAppDispatch } from "../../../hooks"
import { createBot } from "../../../stores/NetworkStore"
import { setBotCreatorSynergies } from "../../../stores/LobbyStore"
import BuilderSynergies from "./builder-synergies"
import { Synergy } from "../../../../../types/enum/Synergy"
import { BotGuideButton } from "../buttons/bot-guide-button"
import {
  DetailledPkm,
  Emotion,
  ModalMode,
  ReadWriteMode
} from "../../../../../types"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { t } from "i18next"

const buttonsStyle: CSS.Properties = {
  left: "10px",
  position: "absolute",
  display: "flex"
}

const buttonStyle: CSS.Properties = {
  marginLeft: "10px",
  marginTop: "10px",
  marginRight: "10px"
}

const bottomContainerStyle: CSS.Properties = {
  display: "flex",
  width: "87%",
  position: "absolute",
  bottom: "0px",
  right: "0px"
}

const DEFAULT_BOT_STATE = {
  steps: [
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    },
    {
      roundsRequired: 2,
      board: []
    }
  ],
  avatar: PkmIndex[Pkm.DITTO],
  author: "",
  elo: 1200,
  name: Pkm.DITTO,
  id: ""
}

export default function TeamBuilder() {
  const dispatch = useAppDispatch()
  const [step, setStep] = useState<number>(0)
  const [copyStep, setCopyStep] = useState<IStep | undefined>(undefined)
  const [bot, setBot] = useState<IBot>(DEFAULT_BOT_STATE)
  const [entity, setEntity] = useState<Item | DetailledPkm>({
    pkm: Pkm.DEFAULT,
    shiny: false,
    emotion: Emotion.NORMAL
  })
  const [mode, setMode] = useState<ReadWriteMode>(ReadWriteMode.WRITE)
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.IMPORT)
  const [modalBoolean, setModalBoolean] = useState<boolean>(false)

  const pastebinUrl: string = useAppSelector((state) => state.lobby.pastebinUrl)
  const botData: IBot = useAppSelector((state) => state.lobby.botData)

  function updateSynergies(i: number) {
    const newSynergies = new Map<Synergy, number>()
    ;(Object.keys(Synergy) as Synergy[]).forEach((s) => {
      newSynergies.set(s, 0)
    })
    const pokemonNames = new Array<Pkm>()
    bot.steps[i].board.forEach((pkm) => {
      const family = PkmFamily[pkm.name]
      const pkmTypes = PokemonFactory.createPokemonFromName(pkm.name).types
      if (!pokemonNames.includes(family)) {
        pokemonNames.push(family)
        pkmTypes.forEach((type: Synergy) => {
          const v = newSynergies.get(type)
          if (v) {
            newSynergies.set(type, v + 1)
          } else {
            newSynergies.set(type, 1)
          }
        })
      }
    })
    dispatch(setBotCreatorSynergies(newSynergies))
  }

  function write(x: number, y: number) {
    if (Object.values(Pkm).includes((entity as DetailledPkm).pkm)) {
      writePokemon(x, y)
    }
    if (Object.keys(Item).includes(entity as Item)) {
      writeItem(x, y)
    }
  }

  function writeItem(x: number, y: number) {
    const potential = bot.steps[step].board.findIndex(
      (p) => p.x == x && p.y == y
    )
    const e = entity as Item
    if (potential >= 0) {
      if (bot.steps[step].board[potential].items.length < 3) {
        setBot(
          produce((draft) => {
            draft.steps[step].board[potential].items.push(e)
          })
        )
      } else {
        setBot(
          produce((draft) => {
            draft.steps[step].board[potential].items = [e]
          })
        )
      }
    }
  }

  function writePokemon(x: number, y: number) {
    const potential = bot.steps[step].board.findIndex(
      (p) => p.x == x && p.y == y
    )
    const e = entity as DetailledPkm
    if (potential >= 0) {
      setBot(
        produce((draft) => {
          draft.steps[step].board[potential].name = e.pkm
          draft.steps[step].board[potential].shiny = e.shiny
          draft.steps[step].board[potential].emotion = e.emotion
        })
      )
    } else {
      setBot(
        produce((draft) => {
          draft.steps[step].board.push({
            name: e.pkm,
            emotion: e.emotion,
            shiny: e.shiny,
            x: x,
            y: y,
            items: []
          })
        })
      )
    }
    updateSynergies(step)
  }

  function erase(x: number, y: number) {
    const potential = bot.steps[step].board.findIndex(
      (p) => p.x == x && p.y == y
    )
    if (potential >= 0) {
      setBot(
        produce((draft) => {
          draft.steps[step].board.splice(potential, 1)
        })
      )
    }
  }

  function importBot(text: string) {
    try {
      const b: IBot = JSON.parse(text)
      setBot(b)
      updateSynergies(step)
      setModalBoolean(false)
    } catch (e) {
      alert(e)
    }
  }

  function create() {
    dispatch(createBot(bot))
  }

  return (
    <div className="bot-panel">
      <div className="header" style={buttonsStyle}>
        <button
          style={buttonStyle}
          onClick={() => {
            setModalMode(ModalMode.IMPORT)
            setModalBoolean(true)
          }}
          className="bubbly orange"
        >
          {t("import")}/{t("load")}
        </button>
        <button
          style={buttonStyle}
          onClick={() => {
            setModalMode(ModalMode.EXPORT)
            setModalBoolean(true)
          }}
          className="bubbly orange"
        >
          {t("export")}
        </button>
        <BotGuideButton />
        <button
          style={buttonStyle}
          onClick={() =>
            setMode(
              mode == ReadWriteMode.WRITE
                ? ReadWriteMode.ERASE
                : ReadWriteMode.WRITE
            )
          }
          className="bubbly green"
          data-tip
          data-for={"mode"}
        >
          {mode} {t("mode")}
          <ReactTooltip
            id={"mode"}
            className="customeTheme"
            effect="solid"
            place="bottom"
          >
            <p>{t("current_edition_click")}</p>
            <p>{t("write_mode_hint")}</p>
            <p> {t("erase_mode_hint")}</p>
          </ReactTooltip>
        </button>
        <button
          style={buttonStyle}
          onClick={() => {
            setCopyStep(JSON.parse(JSON.stringify(bot.steps[step])))
          }}
          className="bubbly green"
          data-tip
          data-for={"copy"}
        >
          <ReactTooltip
            id={"copy"}
            className="customeTheme"
            effect="solid"
            place="bottom"
          >
            <p>{t("copy_current_step")}</p>
            <p> {t("paste_current_step")}</p>
          </ReactTooltip>
          {t("copy_step")}
        </button>
        <button
          style={buttonStyle}
          onClick={() => {
            if (copyStep) {
              setBot(
                produce((draft) => {
                  draft.steps[step] = copyStep
                })
              )
            }
          }}
          className="bubbly green"
          data-tip
          data-for={"paste"}
        >
          <ReactTooltip
            id={"paste"}
            className="customeTheme"
            effect="solid"
            place="bottom"
          >
            <p>{t("paste_current_step_click")}</p>
            <p>{t("paste_current_step_hint")}</p>
          </ReactTooltip>
          {t("paste_step")}
        </button>
      </div>
      <BuilderSynergies />
      <TeamEditor
        step={step}
        steps={bot.steps}
        avatar={bot.avatar}
        author={bot.author}
        name={bot.name}
        elo={bot.elo}
        handleTabClick={(i: number) => {
          updateSynergies(i)
          setStep(i)
        }}
        handleEditorClick={(x, y) => {
          mode == ReadWriteMode.WRITE ? write(x, y) : erase(x, y)
        }}
        handleEloChange={(e) => {
          if (!isNaN(e.target.value)) {
            setBot(
              produce((draft) => {
                draft.elo = e.target.value
              })
            )
          }
        }}
        handleAuthorChange={(e) => {
          setBot(
            produce((draft) => {
              draft.author = e.target.value
            })
          )
        }}
        handleAvatarChange={(e) =>
          setBot(
            produce((draft) => {
              draft.name = e.target.value
              draft.avatar = `${PkmIndex[e.target.value]}/${Emotion.NORMAL}`
            })
          )
        }
        handleRoundsRequiredChange={(e) =>
          setBot(
            produce((draft) => {
              draft.steps[step].roundsRequired = e.target.value
            })
          )
        }
      />
      <SelectedEntity entity={entity} selectEntity={setEntity} />

      <div style={bottomContainerStyle}>
        <ItemPicker selectEntity={setEntity} />
        <PokemonPicker selectEntity={setEntity} />
      </div>

      <ModalMenu
        modalBoolean={modalBoolean}
        showModal={(mode: ModalMode) => {
          setModalMode(mode)
          setModalBoolean(true)
        }}
        bot={bot}
        hideModal={() => {
          setModalBoolean(false)
        }}
        modalMode={modalMode}
        importBot={importBot}
        pasteBinUrl={pastebinUrl}
        createBot={create}
        botData={botData}
      />
    </div>
  )
}
