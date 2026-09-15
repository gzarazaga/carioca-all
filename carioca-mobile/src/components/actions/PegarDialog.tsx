import { View, Text, Modal, ScrollView } from 'react-native'
import { useGameStore, useFormaciones } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'
import Card from '../card/Card'
import FormationGroup from '../game/FormationGroup'
import Button from '../common/Button'
import GlassPanel from '../common/GlassPanel'

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
      <View className="flex-1 bg-black/70 items-center justify-center p-4">
        <GlassPanel style={{ width: '100%', maxWidth: 480, maxHeight: '90%', borderRadius: 24 }}>
          <View className="p-5">
            <Text className="font-display-semibold text-xl text-white mb-4">Pegar carta a formación</Text>

            <ScrollView>
              <View className="mb-4">
                <Text className="text-sm text-felt-300 mb-2">Carta:</Text>
                <Card carta={carta} />
              </View>

              <View className="mb-4">
                <Text className="text-sm text-felt-300 mb-2">Elegir formación:</Text>
                <View className="gap-3">
                  {formaciones.map((f) => (
                    <View key={f.id} className="flex-row items-center gap-2">
                      <FormationGroup formacion={f} />
                      <View className="gap-1">
                        <Button onPress={() => pegar(carta.id, f.id, true)} disabled={loading} variant="accent" size="sm">
                          Al inicio
                        </Button>
                        <Button onPress={() => pegar(carta.id, f.id, false)} disabled={loading} variant="accent" size="sm">
                          Al final
                        </Button>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            <Button onPress={() => setShowPegarDialog(false)} variant="neutral" size="sm" bold={false} style={{ alignSelf: 'flex-start' }}>
              Cancelar
            </Button>
          </View>
        </GlassPanel>
      </View>
    </Modal>
  )
}
