import React from "react"

import "./keybind-info.css"

export default function KeybindInfo() {
  return (
    <div className="nes-container keybind-container">
      <h2>All keybinds</h2>
      <table className="keybind-table">
        <thead>
          <tr className="keybind-table-header">
            <th>Key</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(ALL_KEYBINDS).map(([key, description]) => {
            return (
              <tr key={key}>
                <td>{key}</td>
                <td>{description}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const ALL_KEYBINDS = {
  E: "Sell hovered pokemon",
  F: "Buy experience",
  D: "Refresh shop",
  A: "Play avatar animation",
  S: "Toggle emote menu"
}
