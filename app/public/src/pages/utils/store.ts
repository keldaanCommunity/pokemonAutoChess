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

  put(key: Key, value: any) {
    this.set(key, Object.assign({}, this.get(key), value))
  }

  set(
    key: Key,
    value: any,
    expirationTimeInSeconds = DEFAULT_EXPIRATION_TIME_IN_SECONDS
  ) {
    const expirationDate = Date.now() + expirationTimeInSeconds * 1000
    this.setter(key, { expirationDate, value })
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
  PREFERENCES = "pac_preferences",
  RECONNECTION_TOKEN = "reconnection_token",
  TEAM_PLANNER = "team_planner",
  LAST_PATCH_READ = "last_patch_read"
}

export const localStore = new LocalStore<LocalStoreKeys>()
