const KEY = "pac_preferences";

interface IPreferencesState {
    musicVolume: number
}

const defaultPreferences: IPreferencesState = {
    musicVolume: 30
}

export function loadPreferences(): IPreferencesState {
    try {
        const serializedState = localStorage.getItem(KEY);
        if (!serializedState) return defaultPreferences;
        return JSON.parse(serializedState);
    } catch (e) {
        return defaultPreferences;
    }
}

export async function savePreferences(state: any) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(KEY, serializedState);
    } catch (e) {
        // Ignore if could not be saved
    }
}
