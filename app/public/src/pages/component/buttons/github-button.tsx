import React from "react"

export default function GithubButton() {
  return (
    <a
      href="https://github.com/keldaanCommunity/pokemonAutoChess"
      target="_blank"
      rel="noopener noreferrer"
    >
      <button type="button" className="bubbly">
        <img width={32} src={`assets/ui/github.svg`} style={{ objectFit: "contain" }} />
        Github
      </button>
    </a>
  )
}
