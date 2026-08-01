import { View, Text, Pressable, Modal, ScrollView } from 'react-native'
import { useGameStore, useFormaciones } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'
import Card from '../card/Card'
import FormationGroup from '../game/FormationGroup'

export default function PegarDialog() {
  const show = useGameStore((s) => s.showPegarDialog)
  const selectedCardIds = useGameStore((s) => s.selectedCardIds)
  const misCartas = useGameStore((s) => s.misCartas)
  const setShowPegarDialog = useGameStore((s) => s.setShowPegarDialog)
  const loading = useGameStore((s) => s.loading)
  const formaciones = useFormaciones()
  const { pegar } = useGameActions()

  if (!show || selectedCardIds.length !== 1) return null

  const carta = misCartas.find((c) => c.id === selectedCardIds[0])
  if (!carta) return null

  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => setShowPegarDialog(false)}>
      <View className="flex-1 bg-black/60 items-center justify-center p-4">
        <View className="bg-green-900 border border-green-600 rounded-xl p-6 max-w-lg w-full max-h-[90%]">
          <Text className="text-xl font-bold mb-4 text-white">Pegar carta a formacion</Text>

          <ScrollView>
            <View className="mb-4">
              <Text className="text-sm text-green-300 mb-2">Carta:</Text>
              <Card carta={carta} />
            </View>

            <View className="mb-4">
              <Text className="text-sm text-green-300 mb-2">Elegir formacion:</Text>
              <View className="gap-3">
                {formaciones.map((f) => (
                  <View key={f.id} className="flex-row items-center gap-2">
                    <FormationGroup formacion={f} />
                    <View className="gap-1">
                      <Pressable
                        onPress={() => pegar(carta.id, f.id, true)}
                        disabled={loading}
                        className={`px-3 py-1 bg-purple-600 rounded ${loading ? 'opacity-50' : ''}`}
                      >
                        <Text className="text-xs font-bold text-white">Al inicio</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => pegar(carta.id, f.id, false)}
                        disabled={loading}
                        className={`px-3 py-1 bg-purple-600 rounded ${loading ? 'opacity-50' : ''}`}
                      >
                        <Text className="text-xs font-bold text-white">Al final</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <Pressable
            onPress={() => setShowPegarDialog(false)}
            className="px-4 py-2 bg-gray-600 rounded-lg self-start"
          >
            <Text className="text-sm text-white">Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}
