import CSS from "csstype"
import React from "react"
import { useTranslation } from "react-i18next"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { usePreference } from "../../../preferences"

export default function WikiStatistic() {
  const [antialiasing] = usePreference("antialiasing")
  const { t } = useTranslation()
  return (
    <ul className="wiki-stat">
      <li className="my-box">
        <img
          className={cc({ pixelated: !antialiasing })}
          src="assets/icons/HP.png"
        ></img>
        <h2>{t("stat.HEALTH_POINTS")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.HP"))}
        </p>
      </li>
      <li className="my-box">
        <img
          className={cc({ pixelated: !antialiasing })}
          src="assets/icons/SHIELD.png"
        ></img>
        <h2>{t("stat.SHIELD")}</h2>
        <p className="description">{t("stat_description.SHIELD")}</p>
      </li>
      <li className="my-box">
        <img
          className={cc({ pixelated: !antialiasing })}
          src="assets/icons/DEF.png"
        ></img>
        <h2>{t("stat.DEF")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.DEF"))}
        </p>
      </li>
      <li className="my-box">
        <img
          className={cc({ pixelated: !antialiasing })}
          src="assets/icons/SPE_DEF.png"
        ></img>
        <h2>{t("stat.SPE_DEF")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.SPE_DEF"))}
        </p>
      </li>
      <li className="my-box">
        <img
          className={cc({ pixelated: !antialiasing })}
          src="assets/icons/PP.png"
        ></img>
        <h2>{t("stat.POWER_POINTS")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.MAX_PP"))}
        </p>
      </li>
      <li className="my-box">
        <img
          className={cc({ pixelated: !antialiasing })}
          src="assets/icons/AP.png"
        ></img>
        <h2>{t("stat.AP")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.AP"))}
        </p>
      </li>
      <li className="my-box">
        <img
          className={cc({ pixelated: !antialiasing })}
          src="assets/icons/ATK.png"
        ></img>
        <h2>{t("stat.ATK")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.ATK"))}
        </p>
      </li>
      <li className="my-box">
        <img
          className={cc({ pixelated: !antialiasing })}
          src="assets/icons/RANGE.png"
        ></img>
        <h2>{t("stat.RANGE")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.RANGE"))}
        </p>
      </li>
      <li className="my-box">
        <img
          className={cc({ pixelated: !antialiasing })}
          src="assets/icons/SPEED.png"
        ></img>
        <h2>{t("stat.SPEED")}</h2>
        <p className="description">{t("stat_description.SPEED")}</p>
      </li>
      <li className="my-box">
        <img
          className={cc({ pixelated: !antialiasing })}
          src="assets/icons/CRIT_CHANCE.png"
        ></img>
        <h2>{t("stat.CRIT_CHANCE")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.CRIT_CHANCE"))}
        </p>
      </li>
      <li className="my-box">
        <img
          className={cc({ pixelated: !antialiasing })}
          src="assets/icons/CRIT_POWER.png"
        ></img>
        <h2>{t("stat.CRIT_POWER")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.CRIT_POWER"))}
        </p>
      </li>
      <li className="my-box">
        <img
          className={cc({ pixelated: !antialiasing })}
          src="assets/icons/LUCK.png"
        ></img>
        <h2>{t("stat.LUCK")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.LUCK"))}
        </p>
      </li>
    </ul>
  )
}
