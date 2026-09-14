import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'success' | 'danger' | 'warning' | 'accent' | 'neutral'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  bold?: boolean
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-primary-600 to-pink-500 hover:from-primary-500 hover:to-pink-400 text-white ' +
    'shadow-[0_8px_22px_-4px_oklch(58%_0.22_295_/_0.55)] hover:shadow-[0_10px_28px_-4px_oklch(58%_0.22_295_/_0.7)] ' +
    'focus-visible:ring-primary-400',
  success:
    'bg-success-600/10 border border-success-600 text-success-400 hover:bg-success-600/20 ' +
    'hover:shadow-[0_0_18px_-2px_oklch(75%_0.14_200_/_0.4)] focus-visible:ring-success-400',
  danger:
    'bg-gradient-to-r from-danger-600 to-[oklch(58%_0.22_35)] hover:brightness-110 text-white ' +
    'shadow-[0_8px_22px_-4px_oklch(66%_0.22_25_/_0.5)] focus-visible:ring-danger-400',
  warning:
    'bg-gradient-to-r from-warning-500 to-warning-600 hover:brightness-110 text-felt-900 ' +
    'shadow-[0_8px_22px_-4px_oklch(80%_0.16_85_/_0.45)] focus-visible:ring-warning-400',
  accent:
    'bg-gradient-to-r from-accent-600 to-pink-500 hover:brightness-110 text-white ' +
    'shadow-[0_8px_22px_-4px_oklch(62%_0.22_320_/_0.5)] focus-visible:ring-accent-400',
  neutral:
    'bg-neutral-600/40 border border-neutral-500/60 text-felt-300 hover:bg-neutral-600/60 hover:text-white ' +
    'focus-visible:ring-neutral-400',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-3 text-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  bold = true,
  className = '',
  ...rest
}: ButtonProps) {
  const classes = [
    'rounded-xl transition-all active:scale-[0.98] font-display tracking-wide',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-felt-900',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    bold ? 'font-semibold' : 'font-medium',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <button className={classes} {...rest} />
}