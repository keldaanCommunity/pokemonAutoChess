import type React from "react"
import { cc } from "../../utils/jsx"

export const Box = ({
  children,
  tooltip,
  className
}: {
  children: React.ReactNode
  tooltip?: boolean
  className?: string
}) => (
  <div className={cc("box-wrapper", { "in-tooltip": !!tooltip })}>
    <div className={className}>{children}</div>
  </div>
)

Box.Header = ({
  title,
  children
}: {
  title?: string
  children?: React.ReactNode
}) => (
  <header className="box-header">
    {title && <h2>{title}</h2>}
    {children}
  </header>
)

Box.Content = ({
  children,
  className
}: {
  className?: string
  children: React.ReactNode
}) => <div className={`box-content ${className ?? ""}`}>{children}</div>
