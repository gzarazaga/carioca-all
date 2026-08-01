import { View, Text } from 'react-native'
import { useFormaciones } from '../../stores/gameStore'
import FormationGroup from './FormationGroup'

export default function FormationsArea() {
  const formaciones = useFormaciones()

  if (formaciones.length === 0) return null

  return (
    <View className="w-full">
      <Text className="text-sm text-green-300 mb-2">Formaciones en mesa</Text>
      <View className="flex-row gap-3 flex-wrap justify-center">
        {formaciones.map((f) => (
          <FormationGroup key={f.id} formacion={f} />
        ))}
      </View>
    </View>
  )
}
