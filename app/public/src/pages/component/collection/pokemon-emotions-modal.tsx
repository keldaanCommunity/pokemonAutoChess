import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX } from "../../../../../models/precomputed/precomputed-emotions"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Emotion } from "../../../../../types"
import { BoosterPriceByRarity } from "../../../../../types/Config"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { IPokemonCollectionItemUnpacked } from "../../../../../types/interfaces/UserMetadata"
import { getAvatarSrc, getPortraitSrc } from "../../../../../utils/avatar"
import { PokemonAnimations } from "../../../game/components/pokemon-animations"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import {
  buyBooster,
  buyEmotion,
  changeAvatar,
  changeSelectedEmotion
} from "../../../stores/NetworkStore"
import { cc } from "../../utils/jsx"
import { Modal } from "../modal/modal"
import PokemonPortrait from "../pokemon-portrait"
import PokemonEmotion from "./pokemon-emotion"
import "./pokemon-emotions-modal.css"

export default function PokemonEmotionsModal(props: {
  pokemon: Pkm
  onClose: () => void
}) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const pokemonCollection = useAppSelector(
    (state) =>
      state.network.profile?.pokemonCollection ??
      new Map<string, IPokemonCollectionItemUnpacked>()
  )
  const user = useAppSelector((state) => state.network.profile)

  const index = PkmIndex[props.pokemon]
  const rarity = getPokemonData(props.pokemon).rarity
  const boosterCost = BoosterPriceByRarity[rarity]

  const availableEmotions: Emotion[] = Object.values(Emotion).filter(
    (e, i) => PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[index]?.[i] === 1
  )

  const shinyAvailable =
    PokemonAnimations[props.pokemon]?.shinyUnavailable !== true

  const item = useMemo(
    () =>
      pokemonCollection.get(index) ?? {
        dust: 0,
        emotions: [],
        shinyEmotions: [],
        selectedEmotion: Emotion.NORMAL,
        selectedShiny: false,
        id: "0000",
        played: 0
      },
    [index, pokemonCollection]
  )

  const handlePokemonEmotionClick = useCallback(
    (
      unlocked: boolean,
      update: { index: string; emotion: Emotion; shiny: boolean }
    ) => {
      if (unlocked) {
        dispatch(changeSelectedEmotion(update))
      } else {
        dispatch(buyEmotion(update))
      }
    },
    [dispatch]
  )

  const resetEmotion = useCallback(() => {
    dispatch(
      changeSelectedEmotion({ index: index, emotion: null, shiny: false })
    )
  }, [dispatch])

  return (
    <Modal
      show={true}
      onClose={props.onClose}
      className="pokemon-emotions-modal anchor-top"
      header={
        <>
          <PokemonPortrait
            portrait={{
              index,
              shiny: item.selectedShiny,
              emotion: item.selectedEmotion ?? Emotion.NORMAL
            }}
            className={cc({ unlocked: item != null })}
          />
          <h2>
            {t(`pkm.${props.pokemon}`)} #{PkmIndex[props.pokemon]} -{" "}
            {t("played_times", { count: item.played ?? 0 })}
          </h2>
          <div className="spacer" />
          <p className="dust">
            <img src={getPortraitSrc(index)} className="dust" alt="dust" />
            {item.dust} {t("shards")}{" "}
          </p>
        </>
      }
      body={
        <>
          <section>
            <p>{t("normal_emotions")}</p>
            <div>
              {availableEmotions.map((e) => {
                return (
                  <PokemonEmotion
                    key={e}
                    index={index}
                    shiny={false}
                    unlocked={item && item.emotions.includes(e)}
                    selected={item.selectedEmotion === e && !item.selectedShiny}
                    path={index.replace("-", "/")}
                    emotion={e}
                    dust={item.dust}
                    onClick={() =>
                      handlePokemonEmotionClick(
                        item && item.emotions.includes(e),
                        { index: index, emotion: e, shiny: false }
                      )
                    }
                  />
                )
              })}
            </div>
          </section>
          {shinyAvailable && (
            <section>
              <p>{t("shiny_emotions")}</p>
              <div>
                {availableEmotions.map((e) => {
                  return (
                    <PokemonEmotion
                      key={e}
                      index={index}
                      shiny={true}
                      unlocked={item && item.shinyEmotions.includes(e)}
                      selected={
                        item.selectedEmotion === e && item.selectedShiny
                      }
                      path={`${index.replace("-", "/")}/0000/0001`}
                      emotion={e}
                      dust={item.dust}
                      onClick={() =>
                        handlePokemonEmotionClick(
                          item && item.shinyEmotions.includes(e),
                          { index: index, emotion: e, shiny: true }
                        )
                      }
                    />
                  )
                })}
              </div>
            </section>
          )}
        </>
      }
      footer={
        <>
          <button
            className="bubbly blue"
            disabled={
              (item.emotions.length === 0 && item.shinyEmotions.length === 0) ||
              (user &&
                getAvatarSrc(user?.avatar) ===
                  getPortraitSrc(
                    index,
                    item.selectedShiny,
                    item.selectedEmotion ?? Emotion.NORMAL
                  ))
            }
            onClick={() =>
              dispatch(
                changeAvatar({
                  index,
                  emotion: item.selectedEmotion ?? Emotion.NORMAL,
                  shiny: item.selectedShiny
                })
              )
            }
          >
            {t("choose_as_avatar")}&nbsp;
            <PokemonPortrait
              portrait={{
                index,
                shiny: item.selectedShiny,
                emotion: item.selectedEmotion ?? Emotion.NORMAL
              }}
              alt="avatar"
            />
          </button>

          <button
            className="bubbly orange"
            disabled={item.dust < boosterCost}
            onClick={() => dispatch(buyBooster({ index }))}
          >
            {t("buy_booster", { cost: boosterCost })}
            <img src={getPortraitSrc(index)} className="dust" alt="dust" />
          </button>

          {item.selectedEmotion != null &&
            item.selectedEmotion != Emotion.NORMAL && (
              <button className="bubbly blue" onClick={resetEmotion}>
                {t("reset_emotion")}
              </button>
            )}

          <div className="spacer"></div>
          <button className="bubbly red" onClick={props.onClose}>
            {t("close")}
          </button>
        </>
      }
    />
  )
}
