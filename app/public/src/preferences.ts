import { localStore, LocalStoreKeys } from "./pages/utils/store"

export interface IPreferencesState {
  musicVolume: number
  sfxVolume: number
  showDpsMeter: boolean
  showDetailsOnHover: boolean
}

const defaultPreferences: IPreferencesState = {
  musicVolume: 30,
  sfxVolume: 30,
  showDpsMeter: false,
  showDetailsOnHover: false
}

let preferences: IPreferencesState = loadPreferences()
export function getPreferences() {
  return preferences
}

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
}
