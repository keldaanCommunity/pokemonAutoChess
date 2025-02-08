import Phaser from "phaser"
import { localStore, LocalStoreKeys } from "./pages/utils/store"
import { SetStateAction, useCallback, useEffect, useState } from "react"
import { removeInArray } from "../../utils/array"

export type Keybindings = {
  sell: string
  buy_xp: string
  refresh: string
  lock: string
  switch: string
  emote: string
}
export interface IPreferencesState {
  musicVolume: number
  sfxVolume: number
  playInBackground: boolean
  showDpsMeter: boolean
  showDetailsOnHover: boolean
  showDamageNumbers: boolean
  showEvolutions: boolean
  filterAvailableAddsAndRegionals: boolean
  disableAnimatedTilemap: boolean
  keybindings: Keybindings
  renderer: number
  antialiasing: boolean
}

const defaultPreferences: IPreferencesState = {
  musicVolume: 30,
  sfxVolume: 30,
  playInBackground: false,
  showDpsMeter: false,
  showDetailsOnHover: false,
  showDamageNumbers: true,
  showEvolutions: true,
  filterAvailableAddsAndRegionals: false,
  disableAnimatedTilemap: false,
  renderer: Phaser.AUTO,
  keybindings: {
    sell: "E",
    buy_xp: "F",
    refresh: "D",
    lock: "R",
    switch: "SPACE",
    emote: "A"
  },
  antialiasing: false
}

function loadPreferences(): IPreferencesState {
  if (localStore.has(LocalStoreKeys.PREFERENCES)) {
    return {
      ...defaultPreferences,
      ...localStore.get(LocalStoreKeys.PREFERENCES),
      keybindings: {
        ...defaultPreferences.keybindings,
        ...localStore.get(LocalStoreKeys.PREFERENCES)?.keybindings
      }
    }
  } else {
    return defaultPreferences
  }
}

type Subscription = (newPreferences: IPreferencesState) => void
let preferences: IPreferencesState = Object.freeze(loadPreferences())
const subscriptions: Subscription[] = []

// returns a method that unsubscribes
export function subscribeToPreferences(fn: Subscription, runInitially = false) {
  subscriptions.push(fn)
  if (runInitially) fn(preferences)
  return unsubscribeToPreferences.bind(undefined, fn)
}

export function unsubscribeToPreferences(fn: Subscription) {
  removeInArray(subscriptions, fn)
}

export function preference<T extends keyof IPreferencesState>(
  key: T
): IPreferencesState[T] {
  return preferences[key]
}

// save preferences and notify subscribers
export function savePreferences(
  modified:
    | Partial<IPreferencesState>
    | ((old: IPreferencesState) => Partial<IPreferencesState>)
) {
  const resolved: Partial<IPreferencesState> =
    typeof modified === "function" ? modified(preferences) : modified
  localStore.put(LocalStoreKeys.PREFERENCES, resolved)
  preferences = Object.freeze({ ...preferences, ...resolved })
  subscriptions.forEach((s) => s(preferences))
}

// react hooks
export function usePreferences(): [IPreferencesState, typeof savePreferences] {
  const [preferenceState, setPreferenceState] = useState(preferences)

  // unsubscribes on unmount since `subscribeToPreferences` returns an unsubscribe fn
  useEffect(() => subscribeToPreferences(setPreferenceState), [])

  return [preferenceState, savePreferences]
}

export function usePreference<T extends keyof IPreferencesState>(
  key: T
): [
  IPreferencesState[T],
  (
    set:
      | IPreferencesState[T]
      | ((old: IPreferencesState[T]) => IPreferencesState[T])
  ) => void
] {
  const [preferenceState, setPreferenceState] = useState<IPreferencesState[T]>(
    preferences[key]
  )

  // unsubscribes on unmount since `subscribeToPreferences` returns an unsubscribe fn
  useEffect(
    () =>
      subscribeToPreferences((newPreferences: IPreferencesState) => {
        setPreferenceState(newPreferences[key])
      }),
    [key]
  )

  const update = useCallback(
    (value: IPreferencesState[T] | ((old: IPreferencesState[T]) => void)) => {
      savePreferences({ [key]: value })
    },
    [key]
  )

  return [preferenceState, update]
}
