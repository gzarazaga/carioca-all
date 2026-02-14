interface Props {
  small?: boolean
}

export default function CardBack({ small }: Props) {
  const size = small ? 'w-12 h-18' : 'w-16 h-24'

  return (
    <div
      className={`
        ${size} rounded-lg bg-blue-800 border-2 border-blue-900
        flex items-center justify-center card-shadow select-none
      `}
    >
      <div className="w-[80%] h-[80%] rounded border-2 border-blue-600 bg-blue-700 flex items-center justify-center">
        <span className="text-blue-400 text-lg font-bold">C</span>
      </div>
    </div>
  )
}
