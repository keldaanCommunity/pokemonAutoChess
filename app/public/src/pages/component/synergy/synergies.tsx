import React from "react"
import { SynergyTriggers } from "../../../../../types/Config"
import SynergyComponent from "./synergy-component"
import CSS from "csstype"
import { Synergy } from "../../../../../types/enum/Synergy"
import { t } from "i18next"

const style: CSS.Properties = {
  position: "absolute",
  left: "0.5%",
  display: "flex",
  justifyContent: "space-between",
  width: "8%",
  top: "9%",
  flexFlow: "column",
  maxHeight: "73%",
  overflowY: "scroll",
  padding: "0px",
  color: "#fff",
  backgroundColor: "#61738a"
}

export default function Synergies(props: { synergies: [string, number][] }) {
  if (props.synergies && props.synergies.length > 0) {
    return (
      <div style={style} className="nes-container hidden-scrollable">
        <h5 style={{ padding: "10px", textAlign: "center", fontSize: "1.3vw" }}>
          {t("synergies")}
        </h5>
        {Object.keys(Synergy)
          .sort((a, b) => {
            const fa = props.synergies.find((e) => e[0] == a)
            const fb = props.synergies.find((e) => e[0] == b)
            const sa = fa ? fa : 0
            const sb = fb ? fb : 0
            if (sa[1] == sb[1]) {
              if (sa[1] >= SynergyTriggers[a][0]) {
                return -1
              } else {
                return 1
              }
            } else {
              return sb[1] - sa[1]
            }
          })
          .map((type, index) => {
            // logger.debug(type);
            const s = props.synergies.find((e) => e[0] == type)
            // logger.debug(s);
            if (s && s[1] > 0) {
              return (
                <SynergyComponent
                  key={type}
                  type={type as Synergy}
                  value={s[1]}
                  index={index}
                />
              )
            } else {
              return null
            }
          })}
      </div>
    )
  } else {
    return null
  }
}
