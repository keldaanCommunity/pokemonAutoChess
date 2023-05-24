import React from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import CSS from "csstype"
import PRECOMPUTED_TYPE_POKEMONS_ALL from "../../../../../models/precomputed/type-pokemons-all.json"
import { Item } from "../../../../../types/enum/Item"
import { getPortraitSrc } from "../../../utils"
import { DetailledPkm, Emotion } from "../../../../../types"
import SynergyIcon from "../icons/synergy-icon"
import { Synergy } from "../../../../../types/enum/Synergy"

const pokemonPoolStyle: CSS.Properties = {
  display: "flex",
  flexWrap: "wrap",
  margin: "10px",
  marginTop: "0px"
}

const imgStyle: CSS.Properties = {
  width: "40px",
  height: "40px",
  imageRendering: "pixelated",
  cursor: "var(--cursor-hover)"
}

const cursorStyle: CSS.Properties = {
  cursor: "var(--cursor-hover)"
}

export default function PokemonPicker(props: {
  selectEntity: React.Dispatch<React.SetStateAction<DetailledPkm | Item>>
}) {
  return (
    <Tabs className="nes-container" style={pokemonPoolStyle}>
      <TabList>
        {Object.keys(PRECOMPUTED_TYPE_POKEMONS_ALL).map((t) => {
          return (
            <Tab style={cursorStyle} key={t}>
              <SynergyIcon type={t as Synergy} />
            </Tab>
          )
        })}
        <Tab style={cursorStyle} key="none">
          <img
            src="assets/unown/unown-qm.png"
            alt="?"
            className="unown-icon"
            style={{ margin: "-28px" }}
          />
        </Tab>
      </TabList>

      {Object.keys(PRECOMPUTED_TYPE_POKEMONS_ALL).map((key) => {
        return (
          <TabPanel key={key} style={{ display: "flex", flexWrap: "wrap" }}>
            {PRECOMPUTED_TYPE_POKEMONS_ALL[key].map((pkm) => {
              return (
                <div
                  onClick={() => {
                    props.selectEntity({
                      pkm: pkm,
                      emotion: Emotion.NORMAL,
                      shiny: false
                    })
                  }}
                  key={`${pkm}`}
                >
                  <img style={imgStyle} src={getPortraitSrc(PkmIndex[pkm])} />
                </div>
              )
            })}
          </TabPanel>
        )
      })}

      <TabPanel key="none" style={{ display: "flex", flexWrap: "wrap" }}>
        {[Pkm.KECLEON, Pkm.ARCEUS].map((pkm) => {
          return (
            <div
              onClick={() => {
                props.selectEntity({
                  pkm: pkm,
                  emotion: Emotion.NORMAL,
                  shiny: false
                })
              }}
              key={`${pkm}`}
            >
              <img style={imgStyle} src={getPortraitSrc(PkmIndex[pkm])} />
            </div>
          )
        })}
      </TabPanel>
    </Tabs>
  )
}
