import { useTranslation } from "react-i18next"
import { RarityColor, RarityCost, SynergyTriggers } from "../../../../../config"
import { getWildChance } from "../../../../../models/colyseus-models/synergies"
import { SynergyEffects } from "../../../../../models/effects"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY } from "../../../../../models/precomputed/precomputed-types-and-categories"
import { IPlayer } from "../../../../../types"
import {
  Pkm,
  PkmFamily,
  PkmRegionalVariants
} from "../../../../../types/enum/Pokemon"
import { SpecialGameRule } from "../../../../../types/enum/SpecialGameRule"
import { Synergy } from "../../../../../types/enum/Synergy"
import { IPokemonData } from "../../../../../types/interfaces/PokemonData"
import { isOnBench } from "../../../../../utils/board"
import { roundToNDigits } from "../../../../../utils/number"
import { values } from "../../../../../utils/schemas"
import { selectSpectatedPlayer, useAppSelector } from "../../../hooks"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { getCachedPortrait } from "../game/game-pokemon-portrait"
import SynergyIcon from "../icons/synergy-icon"
import { EffectDescriptionComponent } from "./effect-description"

const keepFirstOfFamily = (arr: Pkm[]): Pkm[] => {
  const seenFamilies = new Set<Pkm>()
  return arr.filter((p) => {
    const family = PkmFamily[p]
    if (seenFamilies.has(family)) return false
    seenFamilies.add(family)
    return true
  })
}

const baseVariant = (pkm: Pkm): Pkm =>
  (Object.keys(PkmRegionalVariants) as Pkm[]).find((p) =>
    PkmRegionalVariants[p]!.includes(pkm)
  ) ?? pkm

export default function SynergyDetailComponent(props: {
  type: Synergy
  value: number
}) {
  const { t } = useTranslation()
  const additionalPokemons = useAppSelector(
    (state) => state.game.additionalPokemons
  )
  const stageLevel = useAppSelector((state) => state.game.stageLevel)
  const spectatedPlayer = useAppSelector(selectSpectatedPlayer)
  const specialGameRule = useAppSelector((state) => state.game.specialGameRule)

  const levelReached = SynergyTriggers[props.type]
    .filter((n) => n <= props.value)
    .at(-1)

  const regulars = keepFirstOfFamily(
    PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY[props.type].pokemons
  )
    .map((p) => getPokemonData(p as Pkm))
    .sort((a, b) => RarityCost[a.rarity] - RarityCost[b.rarity])

  const additionals = keepFirstOfFamily(
    PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY[props.type].additionalPokemons.filter(
      (p) =>
        additionalPokemons.includes(baseVariant(PkmFamily[p])) ||
        specialGameRule === SpecialGameRule.EVERYONE_IS_HERE
    )
  )
    .map((p) => getPokemonData(p as Pkm))

  const uniques = keepFirstOfFamily(
    PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY[props.type].uniquePokemons
  )
    .map((p) => getPokemonData(p as Pkm))

  const legendaries = keepFirstOfFamily(
    PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY[props.type].legendaryPokemons
  )
    .map((p) => getPokemonData(p as Pkm))

  const specials = keepFirstOfFamily(
    PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY[props.type].specialPokemons
  )
    .map((p) => getPokemonData(p as Pkm))

  let additionalInfo = ""

  if (spectatedPlayer) {
    switch (props.type) {
      case Synergy.WILD: {
        const wildChance = getWildChance(spectatedPlayer, stageLevel)
        additionalInfo = t("synergy_description.WILD_ADDITIONAL", {
          wildChance: roundToNDigits(wildChance * 100, 1)
        })
        break
      }
      case Synergy.BABY: {
        additionalInfo = t("synergy_description.BABY_CHANCE_STACKED", {
          eggChance: roundToNDigits(
            (levelReached === 7
              ? spectatedPlayer.goldenEggChance
              : spectatedPlayer.eggChance) * 100,
            1
          )
        })
        break
      }
      case Synergy.DRAGON: {
        const totalDragonStars = values(spectatedPlayer.board).reduce(
          (acc, pokemon) =>
            acc +
            (pokemon.types.has(Synergy.DRAGON) && !isOnBench(pokemon)
              ? pokemon.stars
              : 0),
          0
        )
        additionalInfo = t("synergy_description.DRAGON_STARS", {
          totalStars: totalDragonStars
        })
        break
      }
      case Synergy.ELECTRIC: {
        additionalInfo = t("synergy_description.ELECTRIC_CHARGE", {
          charge: spectatedPlayer.cellBattery
        })
        break
      }
      case Synergy.NORMAL: {
        additionalInfo = t("synergy_description.NORMAL_SCARVES", {
          scarves: spectatedPlayer.scarvesItems.join(" ")
        })
        break
      }
      default:
        break
    }
  }

  if (props.type === Synergy.FAIRY && spectatedPlayer) {
    additionalInfo = t("synergy_description.FAIRY_WANDS", {
      wands: spectatedPlayer.fairyWands.join(" ")
    })
  }

  return (
    <div style={{ maxWidth: "560px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <SynergyIcon type={props.type} size="40px" />
        <h3 style={{ margin: 0 }}>{t(`synergy.${props.type}`)}</h3>
      </div>
      <p style={{ whiteSpace: "pre-wrap" }}>
        {addIconsToDescription(
          t(`synergy_description.${props.type}`, { additionalInfo })
        )}
      </p>

      {SynergyEffects[props.type].map((d, i) => {
        return (
          <div
            key={d}
            style={{
              color:
                levelReached === SynergyTriggers[props.type][i]
                  ? "var(--color-fg-primary)"
                  : "var(--color-fg-secondary)",
              backgroundColor:
                levelReached === SynergyTriggers[props.type][i]
                  ? "var(--color-bg-secondary)"
                  : "transparent",
              border:
                levelReached === SynergyTriggers[props.type][i]
                  ? "var(--border-thick)"
                  : "none",
              borderRadius: "12px",
              padding: "5px"
            }}
          >
            <h4 style={{ fontSize: "1.2em", marginBottom: 0 }}>
              ({SynergyTriggers[props.type][i]}) {t(`effect.${d}`)}
            </h4>
            <EffectDescriptionComponent effect={d} />
          </div>
        )
      })}
      <PokemonPortraitList
        pokemons={regulars}
        type={props.type}
        player={spectatedPlayer}
      />
      <PokemonPortraitList
        pokemons={additionals}
        type={props.type}
        player={spectatedPlayer}
        marginTop="0.5em"
      />
      <PokemonPortraitList
        pokemons={uniques}
        type={props.type}
        player={spectatedPlayer}
        marginTop="0.5em"
      />
      <PokemonPortraitList
        pokemons={legendaries}
        type={props.type}
        player={spectatedPlayer}
        marginTop="0.5em"
      />
      <PokemonPortraitList
        pokemons={specials}
        type={props.type}
        player={spectatedPlayer}
        marginTop="0.5em"
      />
    </div>
  )
}

function PokemonPortraitList(props: {
  pokemons: IPokemonData[]
  type: Synergy
  player?: IPlayer
  marginTop?: string
}) {
  const teamFamilies = new Set(
    props.player == null
      ? []
      : values(props.player.board)
          .filter((x) => x.types.has(props.type))
          .map((x) => PkmFamily[x.name])
  )

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        ...(props.marginTop ? { marginTop: props.marginTop } : {})
      }}
    >
      {props.pokemons.map((p) => (
        <PokemonPortrait
          p={p}
          key={p.name}
          type={props.type}
          player={props.player}
          teamFamilies={teamFamilies}
        />
      ))}
    </div>
  )
}

function PokemonPortrait(props: {
  p: IPokemonData
  type: Synergy
  player?: IPlayer
  teamFamilies: Set<Pkm>
}) {
  return (
    <div
      className={cc("pokemon-portrait", {
        additional: props.p.additional,
        regional: props.p.regional,
        acquired: props.teamFamilies.has(PkmFamily[props.p.name])
      })}
      key={props.p.name}
      style={{
        color: RarityColor[props.p.rarity],
        border: "3px solid " + RarityColor[props.p.rarity]
      }}
    >
      <img
        src={getCachedPortrait(props.p.index, props.player?.pokemonCustoms)}
        alt={`${props.p.name} portrait`}
      />
    </div>
  )
}
