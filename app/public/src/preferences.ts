import Phaser from "phaser"
import { localStore, LocalStoreKeys } from "./pages/utils/store"

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
  showDpsMeter: boolean
  showDetailsOnHover: boolean
  showDamageNumbers: boolean
  disableAnimatedTilemap: boolean
  keybindings: Keybindings
  renderer: number
}

const defaultPreferences: IPreferencesState = {
  musicVolume: 30,
  sfxVolume: 30,
  showDpsMeter: false,
  showDetailsOnHover: false,
  showDamageNumbers: true,
  disableAnimatedTilemap: false,
  renderer: Phaser.AUTO,
  keybindings: {
    sell: "E",
    buy_xp: "F",
    refresh: "D",
    lock: "R",
    switch: "Space",
    emote: "A"
  }
}

export const preferences: IPreferencesState = loadPreferences()

export function loadPreferences(): IPreferencesState {
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

export async function savePreferences(modified: Partial<IPreferencesState>) {
  localStore.put(LocalStoreKeys.PREFERENCES, modified)
  Object.assign(preferences, modified)
}
