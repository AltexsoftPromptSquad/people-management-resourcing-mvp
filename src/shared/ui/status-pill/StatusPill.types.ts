export type StatusPillTone = 'neutral' | 'success' | 'warning' | 'danger'

export type StatusPillProps = {
  tone?: StatusPillTone
  children: string
}
