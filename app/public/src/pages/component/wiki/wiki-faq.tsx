import React from "react"
import { useTranslation } from "react-i18next"

export default function WikiFaq() {
  const { t } = useTranslation()
  return (
    <div className="wiki-faq">
      <details className="my-box">
        <summary>{t("faq.official_game")}</summary>
        <p>{t("faq.official_game_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.how_pokemon_evolve")}</summary>
        <p>{t("faq.how_pokemon_evolve_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.income")}</summary>
        <p>{t("faq.income_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.collection")}</summary>
        <p>{t("faq.collection_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.avatars")}</summary>
        <p>{t("faq.avatars_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.boosters")}</summary>
        <p>{t("faq.boosters_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.level")}</summary>
        <p>{t("faq.level_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.mythical")}</summary>
        <p>{t("faq.mythical_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.ditto")}</summary>
        <p>{t("faq.ditto_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.items")}</summary>
        <p>{t("faq.items_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.bots")}</summary>
        <p>{t("faq.bots_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.create_bot")}</summary>
        <p>{t("faq.create_bot_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.elo")}</summary>
        <p>{t("faq.elo_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.missing_points")}</summary>
        <p>{t("faq.missing_points_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.damage")}</summary>
        <p>{t("faq.damage_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.shiny")}</summary>
        <p>{t("faq.shiny_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.support")}</summary>
        <p>
          {t("faq.support_answer")}
          &nbsp;<a href="https://en.tipeee.com/keldaan">Tipee</a>.
        </p>
      </details>
      <details className="my-box">
        <summary>{t("faq.mobile")}</summary>
        <p>{t("faq.mobile_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("faq.code")}</summary>
        <p>
          {t("faq.code_answer")},&nbsp;
          <a
            href="https://github.com/keldaanCommunity/pokemonAutoChess"
            target="_blank"
          >
            {t("faq.pull_requests")}
          </a>{" "}
          !
        </p>
      </details>
    </div>
  )
}
