import React, { useCallback } from "react"
import { cc } from "../../utils/jsx"

import "./checkbox.css"

interface CheckboxProps {
  checked: boolean
  onToggle?: (value: boolean) => void
  label: string
  isDark?: boolean
  disabled?: boolean
  title?: string
}

export function Checkbox({
  checked,
  onToggle,
  label,
  isDark = false,
  disabled,
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
        className={cc("my-checkbox", { "is-dark": isDark })}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <span>
        {label}
      </span>
    </label>
  )
}
