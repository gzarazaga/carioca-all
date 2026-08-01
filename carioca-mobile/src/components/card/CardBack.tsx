import { View, Text } from 'react-native'
import { CARD_SHADOW } from './Card'

interface Props {
  small?: boolean
}

export default function CardBack({ small }: Props) {
  const size = small ? 'w-12 h-[72px]' : 'w-16 h-24'

  return (
    <View
      className={`${size} rounded-lg bg-blue-800 border-2 border-blue-900 items-center justify-center`}
      style={CARD_SHADOW}
    >
      <View className="w-[80%] h-[80%] rounded border-2 border-blue-600 bg-blue-700 items-center justify-center">
        <Text className="text-blue-400 text-lg font-bold">C</Text>
      </View>
    </View>
  )
}
