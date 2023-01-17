import React from "react"
import Login from "./component/auth/login"
import Media from "./component/auth/media"

const h1Style = {
  fontSize: "5vw",
  color: "white",
  textShadow: "2px 4px 3px rgba(0,0,0,0.3)",
  fontFamily: '"Press Start 2P"'
}

export default function Auth() {
  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          height: "90vh"
        }}
      >
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            width: "35vw",
            marginTop: "5vh",
            marginBottom: "5vh",
            justifyContent: "space-between"
          }}
        >
          <div
            style={{ display: "flex", flexFlow: "column", alignItems: "start" }}
          >
            <h1 style={h1Style}>Pokemon</h1>
            <h1 style={h1Style}>Auto Chess</h1>
          </div>
          <Login />
        </div>
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            marginTop: "5vh",
            marginBottom: "5vh",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <img
            src="assets/ui/pokemon_autochess_final.svg"
            style={{ height: "70vh" }}
          />
        </div>
      </div>
      <Media />
    </div>
  )
}
