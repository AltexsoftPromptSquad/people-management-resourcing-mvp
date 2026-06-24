export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger'

export type BadgeSize = 'sm' | 'md'

export type BadgeProps = {
  children: string
  tone?: BadgeTone
  size?: BadgeSize
  className?: string
}
