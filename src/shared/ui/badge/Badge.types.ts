export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

export type BadgeSize = 'sm' | 'md'

export type BadgeProps = {
  children: string
  tone?: BadgeTone
  size?: BadgeSize
  className?: string
}
