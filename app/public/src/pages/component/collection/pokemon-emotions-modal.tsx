import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  BoosterPriceByRarity,
  PkmColorVariants,
  PkmColorVariantsByPkm
} from "../../../../../config"
import { getAvailableEmotions } from "../../../../../models/precomputed/precomputed-emotions"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Emotion } from "../../../../../types"
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
import { LocalStoreKeys, useLocalStore } from "../../utils/store"
import { Modal } from "../modal/modal"
import PokemonPortrait from "../pokemon-portrait"
import PokemonEmotion from "./pokemon-emotion"
import "./pokemon-emotions-modal.css"
import { use } from "matter"

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

  const [selectedVariant, setSelectedVariant] = useState<Pkm>(props.pokemon)
  useEffect(() => {
    setSelectedVariant(props.pokemon)
  }, [props.pokemon])
  const shardIndex = PkmIndex[props.pokemon]
  const index = PkmIndex[selectedVariant]
  const rarity = getPokemonData(selectedVariant).rarity
  const boosterCost = BoosterPriceByRarity[rarity]

  const availableEmotions = getAvailableEmotions(index, false)
  const shinyAvailableEmotions = getAvailableEmotions(index, true)

  const shinyAvailable =
    PokemonAnimations[selectedVariant]?.shinyUnavailable !== true

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

  const shards = useMemo(
    () => pokemonCollection.get(shardIndex)?.dust ?? 0,
    [shardIndex, pokemonCollection]
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

  const isCurrentAvatar =
    user &&
    getAvatarSrc(user?.avatar) ===
      getPortraitSrc(
        index,
        item.selectedShiny,
        item.selectedEmotion ?? Emotion.NORMAL
      )

  const [favorites, updateFavorites] = useLocalStore<Pkm[]>(
    LocalStoreKeys.FAVORITES,
    [],
    Infinity
  )
  const isFavorite = useMemo(
    () => favorites.includes(selectedVariant) ?? false,
    [favorites, selectedVariant]
  )
  const toggleFavorite = useCallback(() => {
    let newFavorites: Pkm[]
    if (isFavorite) {
      newFavorites = favorites.filter((p) => p !== selectedVariant)
    } else {
      newFavorites = [...favorites, selectedVariant]
    }
    updateFavorites(newFavorites)
  }, [favorites, isFavorite, selectedVariant, updateFavorites])

  const isColorVariant =
    PkmColorVariants.includes(props.pokemon) ||
    props.pokemon in PkmColorVariantsByPkm
  const colorVariants = isColorVariant
    ? [props.pokemon, ...(PkmColorVariantsByPkm[props.pokemon] || [])]
    : []

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
            {t(`pkm.${selectedVariant}`)} #{PkmIndex[selectedVariant]} -{" "}
            {t("played_times", { count: item.played ?? 0 })}
          </h2>
          <div className="spacer" />
          {isColorVariant && (
            <div className="color-variants-select">
              <label>{t("color_variants")}</label>
              <select
                onChange={(e) => setSelectedVariant(e.target.value as Pkm)}
                value={selectedVariant}
              >
                {colorVariants.map((variant) => (
                  <option key={variant} value={variant}>
                    {t(`pkm.${variant}`)} ({variant})
                  </option>
                ))}
              </select>
            </div>
          )}
          <p className="dust">
            <img src={getPortraitSrc(index)} className="dust" alt="dust" />
            {shards} {t("shards")}{" "}
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
                    dust={shards}
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
                {shinyAvailableEmotions.map((e) => {
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
                      dust={shards}
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
              isCurrentAvatar
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
            {isCurrentAvatar ? t("chosen_as_avatar") : t("choose_as_avatar")}
            &nbsp;
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
            disabled={shards < boosterCost}
            onClick={() => dispatch(buyBooster({ index }))}
          >
            {t("buy_booster", { cost: boosterCost })}
            <img src={getPortraitSrc(index)} className="dust" alt="dust" />
          </button>

          {item.selectedEmotion != null &&
            item.selectedEmotion != Emotion.NORMAL && (
              <button className="bubbly blue" onClick={resetEmotion}>
                {t("reset_emotion")}
                &nbsp;
                <PokemonPortrait
                  portrait={{
                    index,
                    shiny: false,
                    emotion: Emotion.NORMAL
                  }}
                  alt="avatar"
                />
              </button>
            )}

          <button
            className={cc("bubbly", isFavorite ? "red" : "green")}
            onClick={toggleFavorite}
          >
            ❤️&nbsp;
            {isFavorite ? t("remove_from_favorites") : t("add_to_favorites")}
          </button>
        </>
      }
    />
  )
}
