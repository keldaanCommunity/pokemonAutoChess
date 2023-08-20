import { useCallback, useState } from "react"
import { useQuery } from "react-query"
import { marked } from "marked"

import { getPreferences, savePreferences } from "../../../preferences"

const HEADING_REGEX = /(?<=<h1>)(.+?)(?=<\/h1>)/
const VERSION_REGEX = /\d+(\.\d+)+/

interface News {
  newsContent: string
  isLoading: boolean
  isError: boolean

  isNewVersion: boolean
  updateNewsVersion: () => void
}

export function useNews(): News {
  const [newVersion, setNewVersion] = useState<string>()
  const { currentVersion } = getPreferences()

  const { data, isLoading, isError } = useQuery(
    "newsContent",
    () =>
      fetch(
        "https://raw.githubusercontent.com/keldaanCommunity/pokemonAutoChess/master/app/public/news.md"
      )
        .then((res) => res.json())
        .then((data) =>
          marked.parse(data, { mangle: false, headerIds: false })
        ),
    {
      onSuccess: (markdown) => {
        const possibleVersion = markdown
          .match(HEADING_REGEX)
          ?.at(0)
          ?.match(VERSION_REGEX)
          ?.at(0)

        if (possibleVersion && currentVersion !== possibleVersion) {
          setNewVersion(possibleVersion)
        }
      },
      refetchOnWindowFocus: false
    }
  )

  const updateNewsVersion = useCallback(async () => {
    await savePreferences({
      currentVersion: newVersion
    })
    setNewVersion(undefined)
  }, [newVersion])

  return {
    newsContent: data ?? "",
    isLoading,
    isError,

    isNewVersion: newVersion != null,
    updateNewsVersion
  }
}
