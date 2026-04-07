import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

type TwitchStream = {
  id: string
  userName: string
  userLogin: string
  title: string
  language: string
  thumbnailUrl: string
  url: string
}

type TwitchStreamsResponse = {
  streams: TwitchStream[]
  isConfigured: boolean
  error: string | null
}

export function TwitchStreams() {
  const { t } = useTranslation()
  const [streams, setStreams] = useState<TwitchStream[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchStreams() {
      try {
        const response = await fetch("/twitch/streams")
        const data = (await response.json()) as TwitchStreamsResponse
        if (!isMounted) {
          return
        }
        setStreams(data.streams ?? [])
        setError(data.error)
      } catch {
        if (isMounted) {
          setError(t("stream.unavailable"))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchStreams()
    const interval = setInterval(fetchStreams, 1000 * 60 * 2)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [t])

  if (isLoading) {
    return <p className="subtitle">{t("loading")}</p>
  }

  if (error && streams.length === 0) {
    return <p className="subtitle">{error}</p>
  }

  return (
    <div className="twitch-streams">
      {streams.map((stream) => (
        <a
          className="twitch-stream-card my-box"
          href={stream.url}
          key={stream.id}
          rel="noreferrer"
          target="_blank"
        >
          <img
            alt={stream.title}
            className="twitch-stream-thumbnail"
            loading="lazy"
            src={stream.thumbnailUrl}
          />
          <div className="twitch-stream-content">
            <h3>{stream.userName}</h3>
            <p>{stream.title}</p>
            <span>
              {t("twitch_streams.language", { language: stream.language })}
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}
