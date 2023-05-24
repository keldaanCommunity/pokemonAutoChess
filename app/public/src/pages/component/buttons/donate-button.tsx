import React from "react"

export default function DonateButton() {
  return (
    <a href="https://en.tipeee.com/pokemon-auto-chess" target="_blank">
      <button className="bubbly pink">
        <img src="assets/ui/donate.svg" alt="" />
        <span className="btn-txt">Donate</span>
        <img
          src="assets/ui/tipeee.svg"
          style={{
            height: "1.25em",
            marginLeft: "0.25em",
            display: "inline-block"
          }}
        />
      </button>
    </a>
  )
}
