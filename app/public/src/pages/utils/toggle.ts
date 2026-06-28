export function closeSiblingDetails(
  event: React.ToggleEvent<HTMLDetailsElement>
) {
  const details = event.currentTarget as HTMLDetailsElement
  if (details.open === false) return
  const detailsElements = (details.parentElement?.children ??
    []) as HTMLCollectionOf<HTMLDetailsElement>
  for (const el of Array.from(detailsElements)) {
    el.open = el === event.currentTarget
    if (el !== event.currentTarget && el.tagName === "DETAILS") {
      el.removeAttribute("open")
    }
  }
}
