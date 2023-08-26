const KEY = "pac_preferences"

export interface IPreferencesState {
  musicVolume: number
  sfxVolume: number
  showDpsMeter: boolean
  showDetailsOnHover: boolean
  currentVersion?: string
}

const defaultPreferences: IPreferencesState = {
  musicVolume: 30,
  sfxVolume: 30,
  showDpsMeter: false,
  showDetailsOnHover: false,
  currentVersion: undefined
}

let preferences: IPreferencesState = loadPreferences()
export function getPreferences() {
  return preferences
}

export function loadPreferences(): IPreferencesState {
  try {
    const serializedState = localStorage.getItem(KEY)
    if (!serializedState) return defaultPreferences
    return { ...defaultPreferences, ...JSON.parse(serializedState) }
  } catch (e) {
    return defaultPreferences
  }
}

export async function savePreferences(modified: Partial<IPreferencesState>) {
  try {
    preferences = Object.assign(loadPreferences(), modified)
    const serializedState = JSON.stringify(preferences)
    localStorage.setItem(KEY, serializedState)
  } catch (e) {
    // Ignore if could not be saved
  }
}
