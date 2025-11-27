import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { precomputedPokemonsImplemented } from "../../../../../../gen/precomputed-pokemons"
import { Pkm, PkmByIndex, PkmIndex } from "../../../../../types/enum/Pokemon"
import { getAvatarString } from "../../../../../utils/avatar"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { changeAvatar } from "../../../stores/NetworkStore"
import { cc } from "../../utils/jsx"
import { LocalStoreKeys, useLocalStore } from "../../utils/store"
import PokemonPortrait from "../pokemon-portrait"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"

export function AvatarTab() {
  const { t } = useTranslation()
  const pokemonCollectionMap = useAppSelector(
    (state) => state.network.profile?.pokemonCollection
  )
  const [favorites, setFavorites] = useLocalStore<Pkm[]>(
    LocalStoreKeys.FAVORITES,
    [],
    Infinity
  )

  const pokemonCollection = useMemo(
    () => (pokemonCollectionMap ? [...pokemonCollectionMap.values()] : []),
    [pokemonCollectionMap]
  )

  const [selectedPkm, setSelectedPkm] = useState<Pkm | "">("")

  const unlocked = pokemonCollection.filter(
    (item) => item.emotions.length > 0 || item.shinyEmotions.length > 0
  )
  const favoritesUnlocked = unlocked.filter((item) =>
    favorites.includes(PkmByIndex[item.id])
  )
  const nbUnlocked = unlocked.length
  const nbTotal = precomputedPokemonsImplemented.length
  const isFavorite = selectedPkm && favorites.includes(selectedPkm)

  return (
    <div>
      <h3 style={{ display: "flex" }}>
        {t("change_avatar")} <div className="spacer"></div>{" "}
        {t("avatars_unlocked", { count: nbUnlocked, total: nbTotal })}
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5em" }}>
        <PokemonTypeahead value={selectedPkm} onChange={setSelectedPkm} />
        {selectedPkm != "" && (
          <>
            <button className="bubbly blue" onClick={() => setSelectedPkm("")}>
              {t("all")}
            </button>
            <div className="spacer"></div>
            <button
              className={cc("bubbly", isFavorite ? "red" : "green")}
              onClick={() => {
                const newFavorites = isFavorite
                  ? favorites.filter((fav) => fav !== selectedPkm)
                  : [...favorites, selectedPkm as Pkm]
                setFavorites(newFavorites)
              }}
            >
              ❤️&nbsp;
              {isFavorite ? t("remove_from_favorites") : t("add_to_favorites")}
            </button>
          </>
        )}
      </div>
      <div>
        {pokemonCollection.length === 0 && <p>{t("play_more_games_hint")}</p>}
        {selectedPkm ? (
          <SelectedPokemonAvatars pokemon={selectedPkm} />
        ) : (
          <>
            <p>❤️&nbsp;{t("favorites")}</p>
            {favoritesUnlocked.length > 0 && (
              <div className="avatar-grid">
                {favoritesUnlocked.map((item) => {
                  return (
                    <PokemonPortrait
                      key={`${item.id}`}
                      className="clickable"
                      onClick={() => {
                        setSelectedPkm(PkmByIndex[item.id])
                      }}
                      portrait={{ index: item.id }}
                    />
                  )
                })}
              </div>
            )}
            <hr />
            <div className="avatar-grid">
              {unlocked.map((item) => {
                return (
                  <PokemonPortrait
                    key={`${item.id}`}
                    className="clickable"
                    onClick={() => {
                      setSelectedPkm(PkmByIndex[item.id])
                    }}
                    portrait={{ index: item.id }}
                  />
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function SelectedPokemonAvatars(props: { pokemon: Pkm }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const pokemonCollectionMap = useAppSelector(
    (state) => state.network.profile?.pokemonCollection
  )
  const currentAvatar = useAppSelector((state) => state.network.profile?.avatar)

  const index = PkmIndex[props.pokemon]
  const pokemonCollectionItem = pokemonCollectionMap?.get(index)

  if (
    !pokemonCollectionItem ||
    (pokemonCollectionItem.emotions.length === 0 &&
      pokemonCollectionItem.shinyEmotions.length === 0)
  )
    return <p>{t("play_more_games_hint")}</p>

  return (
    <div className="emotions-grid">
      {["normal", "shiny"].flatMap((type) =>
        pokemonCollectionItem[
          type === "shiny" ? "shinyEmotions" : "emotions"
        ].map((emotion) => {
          return (
            <div
              className={cc("my-box clickable pokemon-emotion unlocked", {
                selected:
                  getAvatarString(index, type === "shiny", emotion) ===
                  currentAvatar
              })}
              onClick={() => {
                dispatch(
                  changeAvatar({
                    index,
                    emotion,
                    shiny: type === "shiny"
                  })
                )
              }}
            >
              <PokemonPortrait
                key={`${type}-${index}${emotion}`}
                portrait={{
                  index,
                  shiny: type === "shiny",
                  emotion
                }}
              />
              <p>{t(`emotion.${emotion}`)}</p>
            </div>
          )
        })
      )}{" "}
    </div>
  )
}
