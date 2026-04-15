import firebase from "firebase/compat/app"
import { ITypeStatistics } from "../../../types/meta"
import type { IPokemonsStatisticV2 } from "../../../types/models/pokemons-statistic-v2"

export type {
  IHistoryEntry,
  IPokemonStatV2,
  IPokemonsStatisticV2
} from "../../../types/models/pokemons-statistic-v2"

export async function fetchMetaPokemons(): Promise<IPokemonsStatisticV2[]> {
  return fetch("/meta/pokemons").then((res) => res.json())
}

export async function fetchMetaTypes(): Promise<ITypeStatistics> {
  const token = await firebase.auth().currentUser?.getIdToken()
  return fetch("/meta/types", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => res.json())
}
