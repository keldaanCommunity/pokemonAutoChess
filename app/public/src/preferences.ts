const KEY = "pac_preferences"

export interface IPreferencesState {
  musicVolume: number
  sfxVolume: number
  showDpsMeter: boolean
  pokemonDetailsOnHover: boolean
}

const defaultPreferences: IPreferencesState = {
  musicVolume: 30,
  sfxVolume: 30,
  showDpsMeter: false,
  pokemonDetailsOnHover: true
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
    const newPreferences = Object.assign(loadPreferences(), modified)
    const serializedState = JSON.stringify(newPreferences)
    localStorage.setItem(KEY, serializedState)
  } catch (e) {
    // Ignore if could not be saved
  }
}
