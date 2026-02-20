import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { INotification } from "../../../../../types/notifications"
import { Modal } from "../modal/modal"
import "./notification-modal.css"

interface NotificationModalProps {
  notifications: INotification[]
  onClose: (notificationId: string) => void
}

export function NotificationModal({
  notifications,
  onClose
}: NotificationModalProps) {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)

  // Reset index when notifications change
  useEffect(() => {
    setCurrentIndex(0)
  }, [notifications])

  const currentNotification =
    notifications.length > 0 ? notifications[currentIndex] : null

  const handleClose = () => {
    if (!currentNotification) return

    // Send acknowledgment
    onClose(currentNotification.id)

    // Show next notification if available
    if (currentIndex < notifications.length - 1) {
      setCurrentIndex(currentIndex + 1)
      return false // Prevent modal from closing until all notifications are shown
    }
  }

  const closeAll = () => {
    // Acknowledge all remaining notifications
    for (let i = currentIndex; i < notifications.length; i++) {
      onClose(notifications[i].id)
    }
  }

  if (!currentNotification) {
    return null
  }

  const getNotificationTitle = (notification: INotification) => {
    switch (notification.type) {
      case "level_up":
        return t("notification.level_up_title")
      case "new_title":
        return t("notification.new_title_title")
      case "elo_rank_change":
        return t("notification.elo_rank_change_title")
      default:
        return t("notification.level_up_title")
    }
  }

  const getNotificationMessage = (notification: INotification) => {
    switch (notification.type) {
      case "level_up":
        return t("notification.level_up_message", {
          level: notification.message
        })
      case "new_title":
        return t("notification.new_title_message", {
          title: t(`title.${notification.message}`),
          description: t(`title_description.${notification.message}`)
        })
      case "elo_rank_change":
        return t("notification.elo_rank_change_message", {
          rank: t(`elorank.${notification.message}`)
        })
      default:
        return notification.message
    }
  }

  const getIllustrationSrc = (notification: INotification) => {
    switch (notification.type) {
      case "new_title":
        return `/assets/titles/${notification.message}.svg`
      case "elo_rank_change":
        return `/assets/ranks/${notification.message}.svg`
      case "level_up":
      default:
        return "/assets/ui/booster.png"
    }
  }

  return (
    <Modal
      className="notification-modal"
      show={true}
      onClose={handleClose}
      header={getNotificationTitle(currentNotification)}
      body={
        <>
          <img src={getIllustrationSrc(currentNotification)} alt="" />
          <p>{getNotificationMessage(currentNotification)}</p>
        </>
      }
      footer={
        <>
          <button className="bubbly blue" onClick={handleClose}>
            {currentIndex < notifications.length - 1
              ? t("notification.next")
              : t("notification.close")}
          </button>
          {notifications.length > 2 &&
            currentIndex < notifications.length - 1 && (
              <button className="bubbly red" onClick={closeAll}>
                {t("notification.dismiss_all")}
              </button>
            )}
        </>
      }
    />
  )
}
