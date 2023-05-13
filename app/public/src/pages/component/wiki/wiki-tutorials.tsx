import React, { Component } from "react"

export default class WikiTutorials extends Component {
  render() {
    return (
      <div className="wiki-tutorials">
      <ul>
        <li className="nes-container">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/Uq-r48kV0t0" title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
          <h3>How to start a game ?</h3>
        </li>
        <li className="nes-container">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/E_vvXdHosXg" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
          <h3>How to make a lobby with friends ?</h3>
        </li>
        <li className="nes-container">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/LCU5oSyZagw" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
          <h3>Game Screen explained</h3>
        </li>
        <li className="nes-container">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/UjV2TkGYIuM" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
          <h3>5 Tips for Pokemon AutoChess</h3>
        </li>
      </ul>
      <p>Thanks to <a href="https://www.youtube.com/@batotsu2751" target="_blank">Batotsu</a> for his work on tutorial videos !</p>
      </div>
    )
  }
}
