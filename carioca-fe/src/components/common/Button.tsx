import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'success' | 'danger' | 'warning' | 'accent' | 'neutral'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  bold?: boolean
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-400',
  success: 'bg-success-600 hover:bg-success-700 focus-visible:ring-success-400',
  danger: 'bg-danger-600 hover:bg-danger-700 focus-visible:ring-danger-400',
  warning: 'bg-warning-600 hover:bg-warning-700 focus-visible:ring-warning-400',
  accent: 'bg-accent-600 hover:bg-accent-700 focus-visible:ring-accent-400',
  neutral: 'bg-neutral-600 hover:bg-neutral-700 focus-visible:ring-neutral-400',
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
    'rounded-lg transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-felt-900',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    bold ? 'font-bold' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <button className={classes} {...rest} />
}