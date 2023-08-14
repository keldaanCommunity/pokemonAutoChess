import React from "react"
import CSS from "csstype"
import { addIconsToDescription } from "../../utils/descriptions"
import { useTranslation } from "react-i18next"

const imgStyle: CSS.Properties = {
  width: "64px",
  height: "64px",
  imageRendering: "pixelated",
  marginRight: "10px"
}

export default function WikiStatistic() {
  const { t } = useTranslation()
  return (
    <ul className="wiki-stat">
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/HP.png"></img>
        <p>{t("stat.HEALTH_POINTS")}</p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/SHIELD.png"></img>
        <p>{t("stat.SHIELD")}</p>
        <p className="description">{t("stat_description.SHIELD")}</p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/DEF.png"></img>
        <p>{t("stat.DEF")}</p>
        <p className="description">
          {addIconsToDescription(t("stat_description.DEF"))}
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/SPE_DEF.png"></img>
        <p>{t("stat.SPE_DEF")}</p>
        <p className="description">
          {addIconsToDescription(t("stat_description.SPE_DEF"))}
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/PP.png"></img>
        <p>{t("stat.POWER_POINTS")}</p>
        <p className="description">
          {addIconsToDescription(t("stat_description.MAX_PP"))}
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/AP.png"></img>
        <p>{t("stat.AP")}</p>
        <p className="description">
          {addIconsToDescription(t("stat_description.AP"))}
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/ATK.png"></img>
        <p>{t("stat.ATK")}</p>
        <p className="description">
          {addIconsToDescription(t("stat_description.ATK"))}
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/RANGE.png"></img>
        <p>{t("stat.RANGE")}</p>
        <p className="description">
          {addIconsToDescription(t("stat_description.RANGE"))}
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/ATK_SPEED.png"></img>
        <p>{t("stat.ATK_SPEED")}</p>
        <p className="description">{t("stat_description.ATK_SPEED")}</p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/CRIT_CHANCE.png"></img>
        <p>{t("stat.CRIT_CHANCE")}</p>
        <p className="description">
          {addIconsToDescription(t("stat_description.CRIT_CHANCE"))}
        </p>
      </li>
      <li className="nes-container">
        <img style={imgStyle} src="assets/icons/CRIT_DAMAGE.png"></img>
        <p>{t("stat.CRIT_DAMAGE")}</p>
        <p className="description">
          {addIconsToDescription(t("stat_description.CRIT_DAMAGE"))}
        </p>
      </li>
    </ul>
  )
}
