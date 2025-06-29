import {
    IPokemonCollectionItem,
    IUserMetadata
} from "../models/mongo-models/user-metadata"
import { PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX } from "../models/precomputed/precomputed-emotions"
import { getPokemonData } from "../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../models/precomputed/precomputed-rarity"
import { Emotion, PkmWithCustom } from "../types"
import { Booster, BoosterCard } from "../types/Booster"
import {
    BoosterRarityProbability,
    EmotionCost
} from "../types/Config"
import { Ability } from "../types/enum/Ability"
import { Rarity } from "../types/enum/Game"
import { Pkm, PkmIndex, Unowns } from "../types/enum/Pokemon"
import { sum } from "../utils/array"
import { chance, pickRandomIn, randomWeighted } from "../utils/random"

export function createBooster(user: IUserMetadata): Booster {
    const NB_PER_BOOSTER = 10
    const boosterContent: BoosterCard[] = []

    for (let i = 0; i < NB_PER_BOOSTER; i++) {
        const guaranteedUnique = i === NB_PER_BOOSTER - 1
        boosterContent.push(pickRandomPokemonBooster(user, guaranteedUnique))
    }
    return boosterContent
}

export function pickRandomPokemonBooster(
    user: IUserMetadata,
    guarantedUnique: boolean
): BoosterCard {
    let name = Pkm.MAGIKARP
    const rarities = Object.keys(Rarity) as Rarity[]
    const seed = Math.random() * sum(Object.values(BoosterRarityProbability))
    let threshold = 0

    if (guarantedUnique) {
        name = pickRandomIn([
            ...PRECOMPUTED_POKEMONS_PER_RARITY[Rarity.UNIQUE],
            ...PRECOMPUTED_POKEMONS_PER_RARITY[Rarity.LEGENDARY]
        ]) as Pkm
    } else {
        for (let i = 0; i < rarities.length; i++) {
            const rarity = rarities[i]
            const rarityProbability = BoosterRarityProbability[rarity]
            threshold += rarityProbability
            if (seed < threshold) {
                const candidates: Pkm[] = (
                    PRECOMPUTED_POKEMONS_PER_RARITY[rarity] ?? []
                ).filter(
                    (p) =>
                        Unowns.includes(p) === false &&
                        getPokemonData(p).skill !== Ability.DEFAULT
                )
                if (candidates.length > 0) {
                    name = pickRandomIn(candidates) as Pkm
                    break
                }
            }
        }
    }

    const availableEmotions = Object.values(Emotion).filter(
        (e, i) => PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[PkmIndex[name]]?.[i] === 1
    )
    const emotion =
        randomWeighted<Emotion>(
            availableEmotions.reduce(
                (o, e) => ({ ...o, [e]: 1 / EmotionCost[e] }),
                {}
            )
        ) ?? Emotion.NORMAL
    const shiny = chance(0.05)
    const hasAlreadyUnlocked = hasUnlocked(user.pokemonCollection, {
        name,
        shiny,
        emotion
    })

    return { name: name, shiny, emotion, new: !hasAlreadyUnlocked }
}

export function hasUnlocked(
    collection: Map<string, IPokemonCollectionItem>,
    card: PkmWithCustom
): boolean {
    const index = PkmIndex[card.name]
    if (collection.has(index) === false) {
        return false
    }
    const collectionItem = collection.get(index)!
    const emotions = card.shiny
        ? collectionItem.shinyEmotions
        : collectionItem.emotions
    return emotions.includes(card.emotion ?? Emotion.NORMAL)
}
