import React from "react"
import { useAppDispatch } from "../../../hooks"
import { refreshClick } from "../../../stores/NetworkStore"
import { Money } from "../icons/money"

export default function GameRefresh() {
  const dispatch = useAppDispatch()
  return (
    <button
      className="bubbly blue refresh-button"
      title="Refresh shop for 1 gold (shortcut: D)"
      onClick={() => {
        dispatch(refreshClick())
      }}
    >
      <img src={`/assets/ui/refresh.svg`} />
      <Money value="Refresh 1" />
    </button>
  )
}
