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
      <img src="assets/ui/donate.svg" alt="" />
      <span className="btn-txt">Donate</span>
      <img
          src="assets/ui/tipeee.svg"
          style={{ height: "1.25em", marginLeft:"0.25em", display: "inline-block" }}
        />
    </button>
  )
}
