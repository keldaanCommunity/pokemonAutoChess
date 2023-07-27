import React, { useCallback, useEffect, useState } from "react"
import "./game-options-icon.css"
import GameOptionsModal from "./game-options-modal"

export default function GameOptionsIcon(props: { leave: () => void }) {
  const [isOpen, setOpen] = useState<boolean>(false)

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Escape") {
        setOpen(!isOpen)
      }
    },
    [isOpen]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress)
    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [handleKeyPress])

  return (
    <>
      <div
        id="game-options-icon"
        className="nes-container clickable"
        onClick={() => {
          setOpen(true)
        }}
      >
        <img src="/assets/ui/options.svg" />
      </div>
      <GameOptionsModal
        show={isOpen}
        hideModal={() => {
          setOpen(false)
        }}
        leave={props.leave}
      />
    </>
  )
}
