import type { ReactNode } from 'react'
import { toast as toastify, type ToastOptions, type TypeOptions } from 'react-toastify'
import type { ShowToastInput, ToastTone } from './Toast.types'

const DEFAULT_TOAST_DURATION_MS = 4000

const toneClassName: Record<ToastTone, string> = {
  neutral: 'border border-slate-200 bg-white text-slate-950',
  success: 'border border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border border-red-200 bg-red-50 text-red-900',
  warning: 'border border-amber-200 bg-amber-50 text-amber-900',
  info: 'border border-sky-200 bg-sky-50 text-sky-900',
}

const toTypeOption = (tone: ToastTone): TypeOptions =>
  tone === 'neutral' ? 'default' : tone === 'error' ? 'error' : tone

const buildContent = (title: string, description?: string): ReactNode => (
  <div>
    <p className="text-sm font-medium">{title}</p>
    {description ? <p className="mt-1 text-xs opacity-90">{description}</p> : null}
  </div>
)

const addToast = (input: ShowToastInput) => {
  const tone = input.tone ?? 'neutral'

  const options: ToastOptions = {
    type: toTypeOption(tone),
    autoClose: input.durationMs ?? DEFAULT_TOAST_DURATION_MS,
    className: toneClassName[tone],
  }

  return toastify(buildContent(input.title, input.description), options)
}

const dismissToast = (id?: string | number) => {
  toastify.dismiss(id)
}

const toastWithTone =
  (tone: ToastTone) => (title: string, description?: string, durationMs?: number) =>
    addToast({ title, description, durationMs, tone })

export const toast = {
  show: addToast,
  dismiss: dismissToast,
  success: toastWithTone('success'),
  error: toastWithTone('error'),
  warning: toastWithTone('warning'),
  info: toastWithTone('info'),
}
