export type StatusPillTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

export type StatusPillProps = {
  tone?: StatusPillTone
  children: string
}
