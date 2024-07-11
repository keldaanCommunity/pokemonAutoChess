import { localStore, LocalStoreKeys } from "./pages/utils/store"

export type Keybindings = {
  sell: string
  buy_xp: string
  refresh: string
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
}

const defaultPreferences: IPreferencesState = {
  musicVolume: 30,
  sfxVolume: 30,
  showDpsMeter: false,
  showDetailsOnHover: false,
  showDamageNumbers: true,
  disableAnimatedTilemap: false,
  keybindings: {
    sell: "E",
    buy_xp: "F",
    refresh: "D",
    emote: "A"
  }
}

export const preferences: IPreferencesState = loadPreferences()

export function loadPreferences(): IPreferencesState {
  if (localStore.has(LocalStoreKeys.PREFERENCES)) {
    return {
      ...defaultPreferences,
      ...localStore.get(LocalStoreKeys.PREFERENCES)
    }
  } else {
    return defaultPreferences
  }
}

export async function savePreferences(modified: Partial<IPreferencesState>) {
  localStore.put(LocalStoreKeys.PREFERENCES, modified)
  Object.assign(preferences, modified)
}
