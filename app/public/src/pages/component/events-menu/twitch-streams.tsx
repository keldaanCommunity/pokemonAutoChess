import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Role } from "../../../../../types"
import { useAppSelector } from "../../../hooks"
import { addTwitchBlacklist } from "../../../network"
import { RemoveButton } from "../buttons/remove-button"
import { Modal } from "../modal/modal"

type TwitchStream = {
  id: string
  userName: string
  userLogin: string
  title: string
  language: string
  thumbnailUrl: string
  url: string
  viewerCount: number
  startedAt: string
  tags: string[]
}

function formatViewers(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
  }
  return String(count)
}

function formatDuration(startedAt: string): string {
  const diffMs = Date.now() - new Date(startedAt).getTime()
  const totalMinutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) {
    return `${hours}h${String(minutes).padStart(2, "0")}m`
  }
  return `${minutes}m`
}

type TwitchStreamsResponse = {
  streams: TwitchStream[]
  isConfigured: boolean
  error: string | null
}

export function TwitchStreams() {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.network.profile)
  const [streams, setStreams] = useState<TwitchStream[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmStream, setConfirmStream] = useState<TwitchStream | null>(null)
  const [blacklistReason, setBlacklistReason] = useState("")
  const [actionError, setActionError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const canModerateStreams =
    user?.role === Role.ADMIN || user?.role === Role.MODERATOR

  const fetchStreams = useCallback(async () => {
    try {
      const response = await fetch("/twitch/streams")
      const data = (await response.json()) as TwitchStreamsResponse
      setStreams(data.streams ?? [])
      setError(data.error)
    } catch {
      setError(t("stream.unavailable"))
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    let isMounted = true

    fetchStreams().catch(() => undefined)
    const interval = setInterval(
      () => {
        if (isMounted) {
          fetchStreams().catch(() => undefined)
        }
      },
      1000 * 60 * 2
    )

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [fetchStreams])

  async function handleConfirmDelete() {
    if (!confirmStream) {
      return
    }
    setIsDeleting(true)
    setActionError(null)
    try {
      await addTwitchBlacklist(
        confirmStream.userLogin,
        blacklistReason.trim() || undefined
      )
      setConfirmStream(null)
      setBlacklistReason("")
      await fetchStreams()
    } catch (e: any) {
      setActionError(e?.message ?? "Unable to blacklist streamer")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <p className="subtitle">{t("loading")}</p>
  }

  if (error && streams.length === 0) {
    return <p className="subtitle">{error}</p>
  }

  return (
    <>
      {actionError && (
        <p className="subtitle twitch-stream-action-error">{actionError}</p>
      )}
      <div className="twitch-streams">
        {streams.map((stream) => (
          <div className="twitch-stream-card my-box" key={stream.id}>
            <a
              className="twitch-stream-link"
              href={stream.url}
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
                <div className="twitch-stream-meta">
                  <span className="twitch-stream-viewers">
                    {t("twitch_streams.viewers", {
                      count: formatViewers(stream.viewerCount)
                    })}
                  </span>
                  <span className="twitch-stream-live-duration">
                    {t("twitch_streams.live_duration", {
                      duration: formatDuration(stream.startedAt)
                    })}
                  </span>
                </div>
                {stream.tags.length > 0 && (
                  <div className="twitch-stream-tags">
                    {stream.tags.slice(0, 3).map((tag) => (
                      <span className="twitch-stream-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                    {stream.tags.length > 3 && (
                      <span className="twitch-stream-tag twitch-stream-tag-overflow">
                        +{stream.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </a>
            {canModerateStreams && (
              <div className="twitch-stream-delete-btn">
                <RemoveButton
                  title={`Blacklist @${stream.userLogin}`}
                  onClick={() => {
                    setActionError(null)
                    setBlacklistReason("")
                    setConfirmStream(stream)
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        show={Boolean(confirmStream)}
        onClose={() => {
          if (isDeleting) {
            return false
          }
          setBlacklistReason("")
          setConfirmStream(null)
        }}
        header="Confirm Twitch blacklist"
        footer={
          <>
            <button
              className="bubbly blue"
              disabled={isDeleting}
              onClick={() => {
                setBlacklistReason("")
                setConfirmStream(null)
              }}
            >
              Cancel
            </button>
            <button
              className="bubbly red"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
            >
              {isDeleting ? "Blacklisting..." : "Blacklist"}
            </button>
          </>
        }
      >
        <p>
          Add <strong>@{confirmStream?.userLogin}</strong> to Twitch blacklist?
        </p>
        <label className="twitch-blacklist-reason-field">
          <span>Reason</span>
          <input
            type="text"
            className="twitch-blacklist-reason-input"
            maxLength={300}
            placeholder="Optional reason"
            value={blacklistReason}
            onChange={(e) => setBlacklistReason(e.target.value)}
          />
        </label>
      </Modal>
    </>
  )
}
