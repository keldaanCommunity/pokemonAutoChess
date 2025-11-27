import { useCallback, useEffect, useState } from "react"

const DEFAULT_EXPIRATION_TIME_IN_SECONDS = 60 * 60 * 24 * 365

export abstract class Store<Key extends string> {
  abstract getter(key: Key): any
  abstract setter(key: Key, value: any): boolean
  abstract deleter(key: Key): boolean
  abstract cleaner(): void

  constructor(params?: object) {
    Object.assign(this, params)
  }

  has(key: Key) {
    return this.get(key) != null
  }

  get(key: Key): any {
    const data = this.getter(key)
    if (!data || data.value == null) {
      return null
    }
    if (data.expirationDate && Date.now() > data.expirationDate) {
      this.delete(key)
      return null
    }
    return data.value
  }

  put(
    key: Key,
    value: any,
    expirationTimeInSeconds = DEFAULT_EXPIRATION_TIME_IN_SECONDS
  ) {
    this.set(
      key,
      Object.assign({}, this.get(key), value),
      expirationTimeInSeconds
    )
  }

  set(
    key: Key,
    value: any,
    expirationTimeInSeconds = DEFAULT_EXPIRATION_TIME_IN_SECONDS
  ) {
    const expirationDate = Date.now() + expirationTimeInSeconds * 1000
    this.setter(key, { expirationDate, value })
    // On localStoage.setItem, the storage event is only triggered on other tabs and windows.
    // So we manually dispatch a storage event to trigger the subscribe function on the current window as well.
    window.dispatchEvent(new StorageEvent("storage", { key, newValue: value }))
  }

  delete(key: Key) {
    return this.deleter(key)
  }

  clear() {
    return this.cleaner()
  }
}

export class LocalStore<Key extends string> extends Store<Key> {
  getter(key: Key) {
    let parsed
    try {
      parsed = JSON.parse(self.localStorage.getItem(key) ?? "")
    } catch (e) {
      return null
    }
    return parsed
  }

  setter(key: Key, value: any) {
    try {
      self.localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (e) {
      // can fail because of exceeded quota for example
      return false
    }
  }

  deleter(key: string) {
    self.localStorage.removeItem(key)
    return true
  }

  cleaner() {
    return self.localStorage.clear()
  }
}

export enum LocalStoreKeys {
  FAVORITES = "favorites",
  PREFERENCES = "pac_preferences",
  RECONNECTION_LOBBY = "reconnection_lobby",
  RECONNECTION_PREPARATION = "reconnection_preparation",
  RECONNECTION_GAME = "reconnection_game",
  RECONNECTION_AFTER_GAME = "reconnection_after-game",
  TEAM_PLANNER = "team_planner",
  TIER_LIST = "tier_list",
  LAST_PATCH_READ = "last_patch_read",
  COLLECTION_FILTER = "collection_filter"
}

export const localStore = new LocalStore<LocalStoreKeys>()

/**
 * React hook for reactive localStorage access
 * @param key - The localStorage key to watch
 * @param defaultValue - Default value to return if key doesn't exist
 * @returns [value, setValue] tuple similar to useState
 */
export function useLocalStore<T = any>(
  key: LocalStoreKeys,
  defaultValue: T,
  expirationTimeInSeconds?: number
): [T, (value: T) => void, () => void] {
  // Initialize state with current localStorage value or initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    const current = localStore.get(key)
    return current !== null ? current : defaultValue
  })

  // Listen for storage events to update state reactively
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        const newValue = localStore.get(key)
        setStoredValue(newValue !== null ? newValue : defaultValue)
      }
    }

    // Listen for storage events from other tabs/windows and manual dispatches
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [key, defaultValue])

  // Function to update the stored value
  const setValue = useCallback(
    (value: T) => {
      try {
        if (value === null) {
          localStore.delete(key)
        } else {
          localStore.set(key, value, expirationTimeInSeconds)
        }
        setStoredValue(value)

        // Dispatch custom event for immediate updates within the same tab
        window.dispatchEvent(new CustomEvent(`store-update-${key}`))
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key]
  )

  const clearValue = useCallback(() => {
    setStoredValue(defaultValue)
  }, [setStoredValue])

  return [storedValue, setValue, clearValue]
}
