import React from "react"

export default function DonateButton() {
  function handleTipeeClick() {
    window.location.href = "https://en.tipeee.com/pokemon-auto-chess"
  }
  return (
    <button
      className="bubbly pink"
      onClick={() => {
        handleTipeeClick()
      }}
    >
      <span className="btn-txt">Donate</span>
      <img
          src="assets/ui/tipeee.svg"
          style={{ width: "4vw", height: "auto", marginLeft:"1vw", display: "inline-block" }}
        />
    </button>
  )
}
