import Svg, { Path } from 'react-native-svg'

interface IconProps {
  size?: number
  color?: string
}

export function TrophyIcon({ size = 20, color = '#edb417' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7 4h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5V4Z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
      <Path
        d="M7 5H4a2 2 0 0 0 2 3.5M17 5h3a2 2 0 0 1-2 3.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12 13v3M9 20h6M10 20v-2.5a2 2 0 0 1 4 0V20" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  )
}

export function SparkIcon({ size = 20, color = '#edb417' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 1 L14.6 8.6 L22 11 L14.6 13.4 L12 21 L9.4 13.4 L2 11 L9.4 8.6 Z" fill={color} />
    </Svg>
  )
}
