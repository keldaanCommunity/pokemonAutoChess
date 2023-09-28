import { useState } from "react"
import { localStore, LocalStoreKeys } from "../../utils/store"
import pkg from "../../../../../../package.json"

export function usePatchVersion() {
  const latestVersion = pkg.version  
  const [lastVersionChecked, setLastVersionChecked] = useState<string>(localStore.get(LocalStoreKeys.LAST_PATCH_READ))

  const updateVersionChecked = () => {
    localStore.set(LocalStoreKeys.LAST_PATCH_READ, latestVersion)
    setLastVersionChecked(latestVersion)
  }

  return {
    latestVersion,
    lastVersionChecked,
    isNewPatch: !lastVersionChecked || latestVersion > lastVersionChecked,
    updateVersionChecked
  }
}
