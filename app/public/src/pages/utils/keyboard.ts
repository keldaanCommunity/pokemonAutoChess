import { useEffect, useState } from "react"

export const useKeyPress = (targetKey: string): boolean => {
  const [pressed, setPressed] = useState(false)
  const onKeydown = (event: KeyboardEvent) => {
    console.log("onKeydown", event.key)
    if (event.key === targetKey || (event.ctrlKey && targetKey === "Ctrl"))
      setPressed(true)
  }
  const onKeyup = (event: KeyboardEvent) => {
    if (event.key === targetKey || (!event.ctrlKey && targetKey === "Ctrl"))
      setPressed(false)
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeydown)
    window.addEventListener("keyup", onKeyup)
    return () => {
      window.removeEventListener("keydown", onKeydown)
      window.removeEventListener("keyup", onKeyup)
    }
  }, [targetKey])

  return pressed
}
