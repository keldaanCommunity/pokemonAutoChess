import React from "react"
import { useTranslation } from "react-i18next"
import { addIconsToDescription } from "../../utils/descriptions"

export default function WikiStatistic() {
  const { t } = useTranslation()
  return (
    <ul className="wiki-stat">
      <li className="my-box">
        <img src="assets/icons/HP.png" />
        <h2>{t("stat.HEALTH_POINTS")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.HP"))}
        </p>
      </li>
      <li className="my-box">
        <img src="assets/icons/SHIELD.png" />
        <h2>{t("stat.SHIELD")}</h2>
        <p className="description">{t("stat_description.SHIELD")}</p>
      </li>
      <li className="my-box">
        <img src="assets/icons/DEF.png" />
        <h2>{t("stat.DEF")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.DEF"))}
        </p>
      </li>
      <li className="my-box">
        <img src="assets/icons/SPE_DEF.png" />
        <h2>{t("stat.SPE_DEF")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.SPE_DEF"))}
        </p>
      </li>
      <li className="my-box">
        <img src="assets/icons/PP.png" />
        <h2>{t("stat.POWER_POINTS")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.MAX_PP"))}
        </p>
      </li>
      <li className="my-box">
        <img src="assets/icons/AP.png" />
        <h2>{t("stat.AP")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.AP"))}
        </p>
      </li>
      <li className="my-box">
        <img src="assets/icons/ATK.png" />
        <h2>{t("stat.ATK")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.ATK"))}
        </p>
      </li>
      <li className="my-box">
        <img src="assets/icons/RANGE.png" />
        <h2>{t("stat.RANGE")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.RANGE"))}
        </p>
      </li>
      <li className="my-box">
        <img src="assets/icons/SPEED.png" />
        <h2>{t("stat.SPEED")}</h2>
        <p className="description">{t("stat_description.SPEED")}</p>
      </li>
      <li className="my-box">
        <img src="assets/icons/CRIT_CHANCE.png" />
        <h2>{t("stat.CRIT_CHANCE")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.CRIT_CHANCE"))}
        </p>
      </li>
      <li className="my-box">
        <img src="assets/icons/CRIT_POWER.png" />
        <h2>{t("stat.CRIT_POWER")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.CRIT_POWER"))}
        </p>
      </li>
      <li className="my-box">
        <img src="assets/icons/LUCK.png" />
        <h2>{t("stat.LUCK")}</h2>
        <p className="description">
          {addIconsToDescription(t("stat_description.LUCK"))}
        </p>
      </li>
    </ul>
  )
}
