interface Props {
  small?: boolean
}

export default function CardBack({ small }: Props) {
  const size = small ? 'w-12 h-18' : 'w-16 h-24'

  return (
    <div
      className={`
        ${size} rounded-xl card-back-pattern border-2 border-primary-900
        flex items-center justify-center card-shadow select-none relative overflow-hidden
      `}
    >
      <div className="absolute inset-1 rounded-lg border border-warning-400/40" />
      <span className="text-warning-300 text-lg font-serif italic drop-shadow relative">C</span>
    </div>
  )
}
