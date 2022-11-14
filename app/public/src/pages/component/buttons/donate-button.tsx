import React from "react"

export default function DonateButton() {
  function handleTipeeClick() {
    window.location.href = "https://en.tipeee.com/pokemon-auto-chess"
  }
  return (
    <button
      className="bubblyTip"
      onClick={() => {
        handleTipeeClick()
      }}
    >
      <span className="btn-txt">Donate</span>
      <div>
        <img
          src="assets/ui/tipeee.svg"
          style={{ width: "auto", height: "40px", display: "flex" }}
        />
      </div>
    </button>
  )
}
