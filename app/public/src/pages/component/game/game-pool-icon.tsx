import React, { useCallback, useEffect, useState } from "react"
import "./game-options-icon.css"
import { GamePool } from "./game-pool"
import "./game-pool-icon.css"

export function GamePoolIcon() {
  let [isOpen, setOpen] = useState<boolean>(false)

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Escape") {
        setOpen(false)
      } else if (event.key === "p") {
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
        id="game-pool-icon"
        className="nes-container clickable"
        onClick={() => {
          setOpen(!isOpen)
        }}
      >
        <img src="/assets/ui/swimming-pool.png" />
      </div>
      <GamePool visible={isOpen} setVisible={setOpen} />
    </>
  )
}
