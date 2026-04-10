export const NotificationTypes = [
  "level_up",
  "new_title",
  "new_theme",
  "new_gadget",
  "elo_rank_change",
  "victory_road_finished",
  "expedition_completed",
  "tournament_finished",
] as const

export type NotificationType = (typeof NotificationTypes)[number]

export interface INotification {
  id: string
  userId: string
  type: NotificationType
  message: string
  timestamp: number
}
