import React from "react"
import { IDetailledPokemon } from "../../../../../models/mongo-models/bot-v2"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import PokemonPortrait from "../pokemon-portrait"

export default function TeamEditor(props: {
  board: IDetailledPokemon[]
  handleEditorClick: (
    x: number,
    y: number,
    rightClick: boolean,
    itemIndex?: number
  ) => void
  handleDrop: (x: number, y: number, e: React.DragEvent) => void
}) {
  function handleOnDragStart(e: React.DragEvent, p: IDetailledPokemon) {
    e.stopPropagation()
    e.dataTransfer.setData("text/plain", ["cell", p.x, p.y].join(","))
  }

  function handleOnDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    const target = e.target as HTMLElement
    target.classList.add("dragover")
  }

  function handleOnDragEnd(e: React.DragEvent) {
    e.stopPropagation()
    const target = e.target as HTMLElement
    target.classList.remove("dragover")
  }

  function handleDrop(x: number, y: number, e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    props.handleDrop(x, y, e)
    handleOnDragEnd(e)
  }

  return (
    <div id="team-editor">
      <table>
        <tbody>
          {[3, 2, 1].map((y) => {
            return (
              <tr key={"row" + y}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((x) => {
                  const p = props.board.find((p) => p.x === x && p.y === y)
                  return (
                    <td
                      key={"row" + y + "-col" + x}
                      onClick={(e) => {
                        e.preventDefault()
                        props.handleEditorClick(x, y, false)
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        props.handleEditorClick(x, y, true)
                      }}
                      onDragOver={handleOnDragOver}
                      onDragLeave={handleOnDragEnd}
                      onDrop={(e) => handleDrop(x, y, e)}
                    >
                      {p && (
                        <PokemonPortrait
                          portrait={{ index: PkmIndex[p.name], shiny: p.shiny, emotion: p.emotion }}
                          draggable
                          onDragStart={(e) => handleOnDragStart(e, p)}
                        />
                      )}
                      {p && p.items && (
                        <div className="pokemon-items">
                          {p.items.map((it, j) => {
                            return (
                              <img
                                key={j}
                                src={"assets/item/" + it + ".png"}
                                onContextMenu={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  props.handleEditorClick(x, y, true, j)
                                }}
                              />
                            )
                          })}
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
