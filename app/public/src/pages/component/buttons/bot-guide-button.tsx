import React from "react"

export function BotGuideButton() {
  function handleClick() {
    window.location.href =
      "https://docs.google.com/document/d/1vBS4BEV5160Wmy_9Fi_J3ug_bFsyEWDzWFNzcjVvfi4/edit"
  }
  return (
    <button
      style={{ marginTop: "10px" }}
      type="button"
      className="bubbly"
      onClick={() => {
        handleClick()
      }}
    >
      How to make a bot Guide
    </button>
  )
}
