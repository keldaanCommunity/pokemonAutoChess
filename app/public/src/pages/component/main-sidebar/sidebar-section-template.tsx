import React, { ReactNode } from "react"
import { NavLink } from "./main-sidebar"

export function SidebarSectionTemplate({
  children,
  goBack,
}: {
  children: ReactNode
  goBack: () => void
}) {
  return (
    <div className="sidebar-section">
      {children}
      <NavLink className="red logout go-back-btn" onClick={goBack}>
        Back
      </NavLink>
    </div>
  )
}
