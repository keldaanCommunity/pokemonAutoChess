import { useCallback, useEffect, useState } from "react"
import { marked } from "marked"

import { getPreferences, savePreferences } from "../../../preferences"

const HEADING_REGEX = /(?<=<h1>)(.+?)(?=<\/h1>)/
const VERSION_REGEX = /\d+(\.\d+)+/

interface News {
  newsContent: string
  isLoading: boolean

  isNewVersion: boolean
  updateNewsVersion: () => void
}

export function useNews(): News {
  const [newVersion, setNewVersion] = useState<string>()
  const [newsContent, setNewsContent] = useState<string>()
  const { currentVersion } = getPreferences()

  useEffect(() => {
    if (!newsContent) {
      fetch(
        `https://raw.githubusercontent.com/keldaanCommunity/pokemonAutoChess/master/app/public/news.md`
      )
        .then((res) => res.text())
        .then((md) => marked.parse(md, { mangle: false, headerIds: false }))
        .then((parsed) => {
          setNewsContent(parsed)

          const possibleVersion = parsed
            .match(HEADING_REGEX)
            ?.at(0)
            ?.match(VERSION_REGEX)
            ?.at(0)

          if (possibleVersion && currentVersion !== possibleVersion) {
            setNewVersion(possibleVersion)
          }
        })
    }
  }, [currentVersion, newsContent])

  const updateNewsVersion = useCallback(async () => {
    await savePreferences({
      currentVersion: newVersion
    })
    setNewVersion(undefined)
  }, [newVersion])

  return {
    newsContent: newsContent ?? "",
    isLoading: newsContent == null,

    isNewVersion: newVersion != null,
    updateNewsVersion
  }
}
