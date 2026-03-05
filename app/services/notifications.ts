import { INotification, NotificationType } from "../types/notifications"
import { logger } from "../utils/logger"

/**
 * In-memory notification service
 * Stores notifications temporarily until they are acknowledged by the client
 */
class NotificationsService {
  private notifications: Map<string, INotification[]>

  constructor() {
    this.notifications = new Map()
  }

  /**
   * Add a notification for a user
   */
  addNotification(
    userId: string,
    type: NotificationType,
    message: string
  ): void {
    const notification: INotification = {
      id: `${userId}-${Date.now()}-${Math.random()}`,
      userId,
      type,
      message,
      timestamp: Date.now()
    }

    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, [])
    }

    this.notifications.get(userId)!.push(notification)
    //logger.debug(`Notification added for user ${userId}: ${type}`)
  }

  /**
   * Get all pending notifications for a user
   */
  getNotifications(userId: string): INotification[] {
    return this.notifications.get(userId) || []
  }

  /**
   * Clear all notifications for a user (called after they've been shown)
   */
  clearNotifications(userId: string): void {
    this.notifications.delete(userId)
    //logger.debug(`Notifications cleared for user ${userId}`)
  }

  /**
   * Clear a specific notification by ID
   */
  clearNotification(userId: string, notificationId: string): void {
    const userNotifications = this.notifications.get(userId)
    if (userNotifications) {
      const filtered = userNotifications.filter((n) => n.id !== notificationId)
      if (filtered.length > 0) {
        this.notifications.set(userId, filtered)
      } else {
        this.notifications.delete(userId)
      }
      //logger.debug(`Notification ${notificationId} cleared for user ${userId}`)
    }
  }

  /**
   * Get count of pending notifications for a user
   */
  getNotificationCount(userId: string): number {
    return this.notifications.get(userId)?.length || 0
  }

  /**
   * Clean up old notifications (older than 24 hours)
   */
  cleanupOldNotifications(): void {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
    let cleanedCount = 0

    this.notifications.forEach((userNotifications, userId) => {
      const filtered = userNotifications.filter((n) => n.timestamp > oneDayAgo)
      if (filtered.length === 0) {
        this.notifications.delete(userId)
        cleanedCount++
      } else if (filtered.length !== userNotifications.length) {
        this.notifications.set(userId, filtered)
        cleanedCount++
      }
    })

    if (cleanedCount > 0) {
      logger.info(`Cleaned up old notifications for ${cleanedCount} users`)
    }
  }
}

// Export singleton instance
export const notificationsService = new NotificationsService()
