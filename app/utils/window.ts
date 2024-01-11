const notificationIcons = /[🔴🟠🟡🟢🔵🟣💬]/g

export function setTitleNotificationIcon(message: string) {
  document.title = `${message} ${document.title.replace(notificationIcons, "")}`
}

export function clearTitleNotificationIcon() {
  document.title = document.title.replace(notificationIcons, "")
}
