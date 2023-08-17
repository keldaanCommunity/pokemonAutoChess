import React, { useMemo } from "react"
import { Typeahead } from "react-bootstrap-typeahead"

import { TypeaheadProps } from "./types"

import { Status } from "../../../../../types/enum/Status"

export function StatusTypeahead({ onChange }: TypeaheadProps) {
  const statusOptions = useMemo(() => Object.values(Status), [])

  return (
    <Typeahead
      id="status-typeahead"
      options={statusOptions}
      placeholder="Select a status"
      onChange={(option) => {
        const val = option[0] as string
        onChange(val)
      }}
    />
  )
}
