import React, { useState } from "react"
import { marked } from "marked"
import "./news.css"

export default function News() {
  const [newsContent, setNewsContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  fetch(
    `https://raw.githubusercontent.com/keldaanInteractive/pokemonAutoChess/master/app/public/news.md`
  )
    .then((res) => res.text())
    .then((md) => marked.parse(md, { mangle: false, headerIds: false }))
    .then((html) => {
      setNewsContent(html)
      setIsLoading(false)
    })

  return (
    <div className="nes-container news">
      <h1>News</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div
          className="content nes-container"
          dangerouslySetInnerHTML={{ __html: newsContent }}
        ></div>
      )}
    </div>
  )
}
