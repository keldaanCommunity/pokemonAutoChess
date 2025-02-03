import React from "react"
import "./patchnotes.css"
import { Poster } from "./poster"

export default function PatchNotes() {
  const PATCHES = [
    "5.10",
    "5.9",
    "5.8",
    "5.7",
    "5.6",
    "5.5",
    "5.4",
    "5.3",
    "5.2",
    "5.1",
    "5.0",
    "4.9",
    "4.8",
    "4.7",
    "4.6",
    "4.5",
    "4.4",
    "4.3",
    "4.2",
    "4.1",
    "4.0",
    "3.10",
    "3.9",
    "3.8"
  ]

  return (
    <ul>
      {PATCHES.map((v) => (
        <li key={v}>
          <Poster version={v} />
        </li>
      ))}
    </ul>
  )
}
