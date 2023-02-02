import React from "react"

export default function GithubButton() {
  function handleClick() {
    window.location.href =
      "https://github.com/keldaanInteractive/pokemonAutoChess"
  }
  return (
    <button
      type="button"
      className="bubbly"
      onClick={() => {
        handleClick()
      }}
    >
      Github
    </button>
  )
}
