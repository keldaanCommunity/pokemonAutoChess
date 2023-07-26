import React from "react"
import DiscordButton from "../buttons/discord-button"
import GithubButton from "../buttons/github-button"
import PolicyButton from "../buttons/policy-button"
import { t } from "i18next"

export default function Media() {
  return (
    <div className="media">
      <DiscordButton />
      <GithubButton />
      <PolicyButton />
      <span>V3.9</span>
      <p>
        {t("made_for_fans")}
        <br />
        {t("non_profit")} / {t("open_source")}
        <br />
        {t("copyright")}
      </p>
    </div>
  )
}
