import React from "react"
import { useAppDispatch } from "../../../hooks"
import { refreshClick } from "../../../stores/NetworkStore"
import { Money } from "../icons/money"

export default function GameRefresh() {
  const dispatch = useAppDispatch()
  return (
    <button
      className="bubbly blue refresh-button"
      title="Refresh shop for 1 gold"
      onClick={() => {
        dispatch(refreshClick())
      }}
    >
      <Money value="Refresh 1" />
    </button>
  )
}
