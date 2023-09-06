import React, { useCallback } from "react"
import { cc } from "../../utils/jsx"

import "./checkbox.css"

interface CheckboxProps {
  checked: boolean
  onToggle?: (value: boolean) => void
  label: string
  isDark?: boolean
  readOnly?: boolean
  title?: string
}

export function Checkbox({
  checked,
  onToggle,
  label,
  isDark = false,
  readOnly,
  title
}: CheckboxProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation()
      onToggle?.(!checked)
    },
    [checked, onToggle]
  )

  return (
    <label className="checkbox-container" title={title}>
      <input
        type="checkbox"
        className={cc("nes-checkbox", { "is-dark": isDark })}
        checked={checked}
        onChange={handleChange}
        readOnly={readOnly}
      />
      <span>{label}</span>
    </label>
  )
}
