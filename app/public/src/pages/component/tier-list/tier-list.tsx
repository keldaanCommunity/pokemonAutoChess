import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Emotion, PkmWithCustom } from "../../../../../types"
import { Item } from "../../../../../types/enum/Item"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { ITierList } from "../../../../../types/interfaces/TierList"
import { getPortraitSrc } from "../../../../../utils/avatar"
import SynergyIcon from "../icons/synergy-icon"
import "./tier-list.css"

export default function TierList(props: {
  tierList: ITierList
  onUpdate: (tierList: ITierList) => void
}) {
  const { t } = useTranslation()
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null)
  const [editingName, setEditingName] = useState<boolean>(false)
  const [newName, setNewName] = useState<string>(props.tierList.name)
  const [rowLabels, setRowLabels] = useState<string[]>(
    props.tierList.rows.map((row) => row.name)
  )
  const [draggedItem, setDraggedItem] = useState<{
    rowIndex: number
    itemIndex: number
  } | null>(null)
  const [dropZone, setDropZone] = useState<{
    rowIndex: number
    itemIndex: number
  } | null>(null)

  useEffect(() => {
    setRowLabels(props.tierList.rows.map((row) => row.name))
  }, [props.tierList.rows])

  function handleLabelClick(rowIndex: number) {
    setEditingRowIndex(rowIndex)
  }

  function handleNameClick() {
    setEditingName(true)
  }

  function handleLabelChange(rowIndex: number, value: string) {
    const newLabels = [...rowLabels]
    newLabels[rowIndex] = value
    setRowLabels(newLabels)
  }

  function handleNameChange(value: string) {
    setNewName(value)
  }

  function commitLabels() {
    const newRows = props.tierList.rows.map((r, i) => ({
      ...r,
      name: rowLabels[i]
    }))
    props.onUpdate({ name: newName, rows: newRows })
  }

  function handleLabelBlur() {
    setEditingRowIndex(null)
    commitLabels()
  }

  function handleNameBlur() {
    setEditingName(false)
    commitLabels()
  }

  function handleColorChange(rowIndex: number, color: string) {
    const newRows = props.tierList.rows.map((row, index) =>
      index === rowIndex ? { ...row, color } : row
    )
    props.onUpdate({ ...props.tierList, rows: newRows })
  }

  function handleLabelKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      setEditingRowIndex(null)
      commitLabels()
    }
  }

  function handleNameKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      setEditingName(false)
      commitLabels()
    }
  }

  function deleteRow(rowIndex: number) {
    const newRows = props.tierList.rows.filter((_, i) => i !== rowIndex)
    props.onUpdate({ ...props.tierList, rows: newRows })
    setRowLabels(newRows.map((r) => r.name))
    if (editingRowIndex === rowIndex) setEditingRowIndex(null)
  }

  function moveRow(rowIndex: number, direction: "up" | "down") {
    if (
      (direction === "up" && rowIndex === 0) ||
      (direction === "down" && rowIndex === props.tierList.rows.length - 1)
    ) {
      return
    }

    const newRows = [...props.tierList.rows]
    const targetIndex = direction === "up" ? rowIndex - 1 : rowIndex + 1
    const temp = newRows[rowIndex]
    newRows[rowIndex] = newRows[targetIndex]
    newRows[targetIndex] = temp

    props.onUpdate({ ...props.tierList, rows: newRows })
    setRowLabels(newRows.map((r) => r.name))
  }

  function handleItemDragStart(
    rowIndex: number,
    itemIndex: number,
    e: React.DragEvent
  ) {
    setDraggedItem({ rowIndex, itemIndex })
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", "tier-list-item")
  }

  function handleItemDragEnd(e: React.DragEvent) {
    if (draggedItem) {
      // Check if the drop target is outside the tier list
      const tierListElement = e.currentTarget.closest(".tier-list-table")
      const relatedTarget = document.elementFromPoint(e.clientX, e.clientY)

      if (tierListElement && !tierListElement.contains(relatedTarget)) {
        // Remove the item from the tier list
        const newRows = props.tierList.rows.map((row, rowIdx) => {
          if (rowIdx === draggedItem.rowIndex) {
            return {
              ...row,
              items: row.items.filter((_, idx) => idx !== draggedItem.itemIndex)
            }
          }
          return row
        })
        props.onUpdate({ ...props.tierList, rows: newRows })
      }
    }
    setDraggedItem(null)
    setDropZone(null)
  }

  function handleItemDragOver(
    rowIndex: number,
    itemIndex: number,
    e: React.DragEvent
  ) {
    e.preventDefault()
    e.stopPropagation()
    if (draggedItem) {
      // Determine if cursor is on left or right half of the item
      const target = e.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()
      const mouseX = e.clientX
      const midPoint = rect.left + rect.width / 2

      // If mouse is on the right half, insert after this item (itemIndex + 1)
      // If mouse is on the left half, insert before this item (itemIndex)
      const insertIndex = mouseX > midPoint ? itemIndex + 1 : itemIndex

      setDropZone({ rowIndex, itemIndex: insertIndex })
    }
  }

  function handleDrop(
    rowIndex: number,
    itemIndex: number,
    e: React.DragEvent,
    draggedItem: { rowIndex: number; itemIndex: number } | null
  ) {
    e.stopPropagation()
    e.preventDefault()
    const data = e.dataTransfer.getData("text/plain")

    if (!data) return

    // Handle moving items within the tier list
    if (data === "tier-list-item" && draggedItem) {
      const newRows = props.tierList.rows.map((row) => ({
        ...row,
        items: [...row.items]
      }))

      // Get the dragged item
      const item = newRows[draggedItem.rowIndex].items[draggedItem.itemIndex]

      // Remove from source
      newRows[draggedItem.rowIndex].items.splice(draggedItem.itemIndex, 1)

      // Adjust target index if moving within same row
      let targetIndex = itemIndex
      if (
        draggedItem.rowIndex === rowIndex &&
        draggedItem.itemIndex < itemIndex
      ) {
        targetIndex--
      }

      // Add to destination
      if (newRows[rowIndex]) {
        newRows[rowIndex].items.splice(targetIndex, 0, item)
      }

      props.onUpdate({ ...props.tierList, rows: newRows })
      return
    }

    const [type, value] = data.split(",")

    // Create the appropriate item based on type
    let newItem: Item | PkmWithCustom | Synergy

    if (type === "item") {
      newItem = value as Item
    } else if (type === "pokemon") {
      newItem = {
        name: value as Pkm,
        shiny: false,
        emotion: Emotion.NORMAL
      } as PkmWithCustom
    } else if (type === "synergy") {
      newItem = value as Synergy
    } else {
      return // Unknown type
    }

    // Add item to the tier list
    const newRows = [...props.tierList.rows]
    if (newRows[rowIndex]) {
      newRows[rowIndex].items.splice(itemIndex, 0, newItem)
    }
    props.onUpdate({ ...props.tierList, rows: newRows })
  }

  function handleItemRightClick(
    rowIndex: number,
    itemIndex: number,
    e: React.MouseEvent
  ) {
    e.preventDefault()
    e.stopPropagation()

    const newRows = props.tierList.rows.map((row, rowIdx) => {
      if (rowIdx === rowIndex) {
        return {
          ...row,
          items: row.items.filter((_, idx) => idx !== itemIndex)
        }
      }
      return row
    })

    props.onUpdate({ ...props.tierList, rows: newRows })
  }

  function isPokemon(
    item: Item | PkmWithCustom | Synergy
  ): item is PkmWithCustom {
    return (item as PkmWithCustom).name !== undefined
  }

  function isSynergy(item: Item | PkmWithCustom | Synergy): item is Synergy {
    return (
      typeof item === "string" &&
      Object.values(Synergy).includes(item as Synergy)
    )
  }

  function renderItemImage(item: Item | PkmWithCustom | Synergy) {
    if (isPokemon(item)) {
      const pokemon = item as PkmWithCustom
      return (
        <img
          src={getPortraitSrc(
            PkmIndex[pokemon.name],
            pokemon.shiny,
            pokemon.emotion
          )}
          alt={pokemon.name}
          className="tier-list-pokemon-icon"
        />
      )
    } else if (isSynergy(item)) {
      return (
        <div className="tier-list-synergy-icon">
          <SynergyIcon type={item as Synergy} size="48px" />
        </div>
      )
    } else {
      return (
        <img
          src={`assets/item/${item}.png`}
          alt={item}
          className="tier-list-item-icon"
        />
      )
    }
  }

  return (
    <div id="tier-list">
      <table className="tier-list-table">
        <thead>
          <tr>
            <th colSpan={3}>
              {editingName ? (
                <textarea
                  rows={1}
                  value={newName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={handleNameBlur}
                  onKeyDown={handleNameKeyDown}
                  autoFocus
                  className="tier-list-label-input"
                  placeholder={t("tier_list.title")}
                />
              ) : (
                <div className="tier-list-label" onClick={handleNameClick}>
                  {props.tierList.name}
                </div>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {props.tierList.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="tier-list-row">
              <td
                className="tier-list-label-cell"
                style={{ backgroundColor: row.color }}
              >
                {editingRowIndex === rowIndex ? (
                  <textarea
                    value={rowLabels[rowIndex]}
                    onChange={(e) =>
                      handleLabelChange(rowIndex, e.target.value)
                    }
                    onBlur={handleLabelBlur}
                    onKeyDown={handleLabelKeyDown}
                    autoFocus
                    className="tier-list-label-input"
                    rows={1}
                  />
                ) : (
                  <div
                    className="tier-list-label"
                    onClick={() => handleLabelClick(rowIndex)}
                  >
                    {rowLabels[rowIndex]}
                  </div>
                )}
              </td>
              <td
                className="tier-list-items-cell"
                onDrop={(e) => {
                  handleDrop(rowIndex, row.items.length, e, draggedItem)
                  setDropZone(null)
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (draggedItem) {
                    setDropZone({ rowIndex, itemIndex: row.items.length })
                  }
                }}
              >
                <div className="tier-list-items">
                  {row.items.map((item, itemIndex) => {
                    const isDragging =
                      draggedItem?.rowIndex === rowIndex &&
                      draggedItem?.itemIndex === itemIndex
                    const showDropBefore =
                      dropZone?.rowIndex === rowIndex &&
                      dropZone?.itemIndex === itemIndex &&
                      draggedItem &&
                      !(
                        draggedItem.rowIndex === rowIndex &&
                        draggedItem.itemIndex === itemIndex
                      )

                    return (
                      <React.Fragment key={itemIndex}>
                        {showDropBefore && (
                          <div className="tier-list-drop-indicator" />
                        )}
                        <div
                          className={`tier-list-item${isDragging ? " dragging" : ""}`}
                          draggable
                          onDragStart={(e) =>
                            handleItemDragStart(rowIndex, itemIndex, e)
                          }
                          onDragEnd={handleItemDragEnd}
                          onDrop={(e) => {
                            const insertIndex =
                              dropZone?.rowIndex === rowIndex &&
                              dropZone?.itemIndex !== undefined
                                ? dropZone.itemIndex
                                : itemIndex
                            handleDrop(rowIndex, insertIndex, e, draggedItem)
                            setDropZone(null)
                          }}
                          onDragOver={(e) =>
                            handleItemDragOver(rowIndex, itemIndex, e)
                          }
                          onContextMenu={(e) =>
                            handleItemRightClick(rowIndex, itemIndex, e)
                          }
                        >
                          {renderItemImage(item)}
                        </div>
                      </React.Fragment>
                    )
                  })}
                  {dropZone?.rowIndex === rowIndex &&
                    dropZone?.itemIndex === row.items.length &&
                    draggedItem &&
                    !(
                      draggedItem.rowIndex === rowIndex &&
                      draggedItem.itemIndex === row.items.length
                    ) && <div className="tier-list-drop-indicator" />}
                </div>
              </td>
              <td className="tier-list-actions-column">
                <div className="tier-list-row-controls">
                  <input
                    type="color"
                    value={row.color || "#2a2a2a"}
                    onChange={(e) =>
                      handleColorChange(rowIndex, e.target.value)
                    }
                    className="tier-list-color-picker"
                    title="Change row color"
                  />
                  <button
                    className="bubbly dark tier-list-move-up"
                    onClick={() => moveRow(rowIndex, "up")}
                    disabled={rowIndex === 0}
                    title={t("tier_list.move_row_up")}
                    type="button"
                  >
                    ▲
                  </button>
                  <button
                    className="bubbly dark tier-list-move-down"
                    onClick={() => moveRow(rowIndex, "down")}
                    disabled={rowIndex === props.tierList.rows.length - 1}
                    title={t("tier_list.move_row_down")}
                    type="button"
                  >
                    ▼
                  </button>
                  <button
                    className="bubbly red tier-list-delete-row"
                    onClick={() => deleteRow(rowIndex)}
                    title={t("tier_list.delete_row")}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
