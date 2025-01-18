import React from "react";
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "../../../../../models/precomputed/precomputed-types";
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data";
import { Ability } from "../../../../../types/enum/Ability";
import { Rarity } from "../../../../../types/enum/Game";
import { Pkm } from "../../../../../types/enum/Pokemon";
import { groupBy } from "../../../../../utils/array";
import { IPokemonData } from "../../../../../types/interfaces/PokemonData";

import { Tooltip } from "react-tooltip";
import { RarityColor } from "../../../../../types/Config";
import { getPortraitSrc } from "../../../../../utils/avatar";
import { cc } from "../../utils/jsx";
import { GamePokemonDetail } from "../game/game-pokemon-detail";
import { useTranslation } from "react-i18next";

export default function PokemonList({ selectedSynergies }) {
  const { t } = useTranslation();
  if (selectedSynergies.length === 0) {
    return (
      <div className="no-type-container"> {t("no_type_selected_label")}</div>
    );
  }
  const pokemons: IPokemonData[] = PRECOMPUTED_POKEMONS_PER_TYPE[
    selectedSynergies[0]
  ]
    .filter((p) => p !== Pkm.DEFAULT)
    .map((p) => getPokemonData(p))
    .filter((pokemon) =>
      selectedSynergies[1] ? pokemon.types.includes(selectedSynergies[1]) : true
    )
    .sort((a, b) => a.stars - b.stars) // put first stage first
    .filter((p) => {
      if (p.skill === Ability.DEFAULT) return false; // pokemons with no ability are not ready for the show
      if (p.rarity === Rarity.SPECIAL) return true; // show all summons & specials, even in the same family
      return true;
    });

  const pokemonsPerRarity = groupBy(pokemons, (p) => p.rarity);

  for (const rarity in pokemonsPerRarity) {
    pokemonsPerRarity[rarity].sort((a: IPokemonData, b: IPokemonData) => {
      if (a.regional !== b.regional) return +a.regional - +b.regional;
      if (a.additional !== b.additional) return +a.additional - +b.additional;
      return a.index < b.index ? -1 : 1;
    });
  }

  return (
    <div className="pokemon-list">
      {(Object.values(Rarity) as Rarity[]).map((rarity) => {
        return (
          <div key={rarity}>
            <div style={{ color: RarityColor[rarity] }}>
              {t(`rarity.${rarity}`)}
            </div>
            <div className="pokemon-portrait-container">
              {(pokemonsPerRarity[rarity] ?? []).map((p) => {
                return (
                  <div
                    key={p.name}
                    className={cc("pokemon-portrait", {
                      additional: p.additional,
                      regional: p.regional,
                    })}
                  >
                    <img
                      src={getPortraitSrc(p.index)}
                      data-tooltip-id={`pokemon-detail-${p.index}`}
                    />
                    <Tooltip
                      id={`pokemon-detail-${p.index}`}
                      className="custom-theme-tooltip game-pokemon-detail-tooltip"
                    >
                      <GamePokemonDetail pokemon={p.name} />
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
