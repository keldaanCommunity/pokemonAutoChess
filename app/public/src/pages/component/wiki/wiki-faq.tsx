import { t } from "i18next"
import React, { Component } from "react"

export default class WikiFaq extends Component {
  render() {
    return (
      <div style={{ padding: "1em" }}>
        <h4 className="nes-text is-success">{t("faq.official_game")}</h4>
        <p>{t("faq.official_game_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.how_pokemon_evolve")}</h4>
        <p>{t("faq.how_pokemon_evolve_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.additional_synergies")}</h4>
        <p>{t("faq.additional_synergies_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.income")}</h4>
        <p>{t("faq.income_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.collection")}</h4>
        <p>{t("faq.collection_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.avatars")}</h4>
        <p>{t("faq.avatars_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.boosters")}</h4>
        <p>{t("faq.boosters_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.level")}</h4>
        <p>{t("faq.level_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.sprite")}</h4>
        <p>
          {t("faq.sprite_answer1")}
          <a href="https://github.com/PMDCollab/SpriteCollab">
            https://github.com/PMDCollab/SpriteCollab
          </a>
          . {t("faq.sprite_answer2")}
        </p>
        <h4 className="nes-text is-success">{t("faq.pve")}</h4>
        <p>{t("faq.pve_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.mythical")}</h4>
        <p>{t("faq.mythical_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.ditto")}</h4>
        <p>{t("faq.ditto_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.items")}</h4>
        <p>{t("faq.items_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.bots")}</h4>
        <p>{t("faq.bots_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.create_bot")}</h4>
        <p>{t("faq.create_bot_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.elo")}</h4>
        <p>{t("faq.elo_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.missing_points")}</h4>
        <p>{t("faq.missing_points_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.damage")}</h4>
        <p>{t("faq.damage_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.defense")}</h4>
        <p>{t("faq.defense_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.shiny")}</h4>
        <p>{t("faq.shiny_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.support")}</h4>
        <p>
          {t("faq.support_answer")}
          <a href="https://en.tipeee.com/pokemon-auto-chess">Tipeee</a>.
        </p>
        <h4 className="nes-text is-success">{t("faq.mobile")}</h4>
        <p>{t("faq.mobile_answer")}</p>
        <h4 className="nes-text is-success">{t("faq.code")}</h4>
        <p>
          {t("faq.code_answer")},
          <a
            href="https://github.com/keldaanCommunity/pokemonAutoChess"
            target="_blank"
          >
            {t("faq.pull_requests")}
          </a>{" "}
          !
        </p>
      </div>
    )
  }
}
