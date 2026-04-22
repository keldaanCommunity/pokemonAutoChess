import { useTranslation } from "react-i18next"

export default function WikiFaq() {
  const { t } = useTranslation()
  return (
    <div className="wiki-faq">
      <details className="my-box">
        <summary>{t("wiki.faq.official_game")}</summary>
        <p>{t("wiki.faq.official_game_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.how_pokemon_evolve")}</summary>
        <p>{t("wiki.faq.how_pokemon_evolve_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.income")}</summary>
        <p>{t("wiki.faq.income_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.collection")}</summary>
        <p>{t("wiki.faq.collection_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.avatars")}</summary>
        <p>{t("wiki.faq.avatars_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.boosters")}</summary>
        <p>{t("wiki.faq.boosters_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.level")}</summary>
        <p>{t("wiki.faq.level_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.mythical")}</summary>
        <p>{t("wiki.faq.mythical_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.ditto")}</summary>
        <p>{t("wiki.faq.ditto_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.items")}</summary>
        <p>{t("wiki.faq.items_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.bots")}</summary>
        <p>{t("wiki.faq.bots_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.create_bot")}</summary>
        <p>{t("wiki.faq.create_bot_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.elo")}</summary>
        <p>{t("wiki.faq.elo_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.missing_points")}</summary>
        <p>{t("wiki.faq.missing_points_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.damage")}</summary>
        <p>{t("wiki.faq.damage_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.shiny")}</summary>
        <p>{t("wiki.faq.shiny_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.support")}</summary>
        <p>
          {t("wiki.faq.support_answer")}
          &nbsp;<a href="https://en.tipeee.com/keldaan">Tipee</a>.
        </p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.mobile")}</summary>
        <p>{t("wiki.faq.mobile_answer")}</p>
      </details>
      <details className="my-box">
        <summary>{t("wiki.faq.code")}</summary>
        <p>
          {t("wiki.faq.code_answer")},&nbsp;
          <a
            href="https://github.com/keldaanCommunity/pokemonAutoChess"
            target="_blank"
          >
            {t("wiki.faq.pull_requests")}
          </a>{" "}
          !
        </p>
      </details>
    </div>
  )
}
