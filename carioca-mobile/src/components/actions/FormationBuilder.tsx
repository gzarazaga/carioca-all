import { useState } from 'react'
import { View, Text, Pressable, Modal, ScrollView } from 'react-native'
import { useGameStore } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'
import type { FormacionInput } from '../../types/game'
import Card from '../card/Card'
import Button from '../common/Button'
import GlassPanel from '../common/GlassPanel'

type TipoFormacion = 'PIERNA' | 'ESCALERA'

export default function FormationBuilder() {
  const show = useGameStore((s) => s.showFormationBuilder)
  const selectedCardIds = useGameStore((s) => s.selectedCardIds)
  const misCartas = useGameStore((s) => s.misCartas)
  const setShowFormationBuilder = useGameStore((s) => s.setShowFormationBuilder)
  const loading = useGameStore((s) => s.loading)
  const { bajar } = useGameActions()

  const [formaciones, setFormaciones] = useState<FormacionInput[]>([])
  const [currentCardIds, setCurrentCardIds] = useState<string[]>([])
  const [currentTipo, setCurrentTipo] = useState<TipoFormacion>('PIERNA')

  // Resetear estado cada vez que el builder se abre (ajuste durante el render, sin efecto)
  const [prevShow, setPrevShow] = useState(show)
  if (show !== prevShow) {
    setPrevShow(show)
    if (show) {
      setFormaciones([])
      setCurrentCardIds([])
      setCurrentTipo('PIERNA')
    }
  }

  if (!show) return null

  const assignedIds = formaciones.flatMap((f) => f.cartaIds)
  const poolIds = selectedCardIds.filter(
    (id) => !assignedIds.includes(id) && !currentCardIds.includes(id),
  )
  const poolCartas = misCartas.filter((c) => poolIds.includes(c.id))
  const currentCartas = misCartas.filter((c) => currentCardIds.includes(c.id))

  function toggleCard(cardId: string) {
    setCurrentCardIds((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId],
    )
  }

  function agregarFormacion() {
    if (currentCardIds.length < 3) return
    setFormaciones((prev) => [...prev, { tipo: currentTipo, cartaIds: currentCardIds }])
    setCurrentCardIds([])
    setCurrentTipo('PIERNA')
  }

  function quitarFormacion(index: number) {
    setFormaciones((prev) => prev.filter((_, i) => i !== index))
  }

  async function confirmar() {
    const all: FormacionInput[] =
      currentCardIds.length >= 3
        ? [...formaciones, { tipo: currentTipo, cartaIds: currentCardIds }]
        : [...formaciones]
    if (all.length === 0) return
    await bajar(all)
    setFormaciones([])
    setCurrentCardIds([])
  }

  const canAgregar = currentCardIds.length >= 3 && poolIds.length > 0
  const totalFormaciones = formaciones.length + (currentCardIds.length >= 3 ? 1 : 0)
  const canConfirmar = !loading && totalFormaciones > 0

  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => setShowFormationBuilder(false)}>
      <View className="flex-1 bg-black/70 items-center justify-center p-4">
        <GlassPanel style={{ width: '100%', maxWidth: 480, maxHeight: '90%', borderRadius: 24 }}>
          <View className="p-5" style={{ maxHeight: '100%' }}>
            <Text className="font-display-semibold text-xl text-white mb-4">Bajar formaciones</Text>

            <ScrollView>
              {poolCartas.length > 0 && (
                <View className="mb-4">
                  <Text className="text-sm text-felt-300 mb-2">
                    Cartas disponibles{' '}
                    <Text className="text-xs text-felt-400">(tocá para agregar a la formación actual)</Text>
                  </Text>
                  <View className="flex-row gap-1 flex-wrap">
                    {poolCartas.map((c) => (
                      <Card key={c.id} carta={c} small onPress={() => toggleCard(c.id)} />
                    ))}
                  </View>
                </View>
              )}

              <View className="mb-4 border border-felt-600 rounded-xl p-3">
                <Text className="text-sm text-felt-300 mb-2 font-body-semibold">
                  Formación actual{formaciones.length > 0 ? ` (#${formaciones.length + 1})` : ''}:
                </Text>

                {currentCartas.length > 0 ? (
                  <View className="flex-row gap-1 flex-wrap mb-3">
                    {currentCartas.map((c) => (
                      <Card key={c.id} carta={c} small selected onPress={() => toggleCard(c.id)} />
                    ))}
                  </View>
                ) : (
                  <Text className="text-xs text-felt-400 mb-3">
                    {poolIds.length > 0
                      ? 'Seleccioná cartas de arriba para armar esta formación'
                      : 'No quedan cartas disponibles'}
                  </Text>
                )}

                <View className="flex-row items-center gap-2 flex-wrap">
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => setCurrentTipo('PIERNA')}
                      className={`px-3 py-2 rounded-xl ${currentTipo === 'PIERNA' ? 'bg-primary-600' : 'bg-felt-700'}`}
                    >
                      <Text className="font-body-bold text-xs text-white">Pierna</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setCurrentTipo('ESCALERA')}
                      className={`px-3 py-2 rounded-xl ${currentTipo === 'ESCALERA' ? 'bg-primary-600' : 'bg-felt-700'}`}
                    >
                      <Text className="font-body-bold text-xs text-white">Escalera</Text>
                    </Pressable>
                  </View>

                  {poolIds.length > 0 && (
                    <Button onPress={agregarFormacion} disabled={!canAgregar} variant="warning" size="sm">
                      + Agregar al listado
                    </Button>
                  )}
                </View>
              </View>

              {formaciones.length > 0 && (
                <View className="mb-4">
                  <Text className="text-sm text-felt-300 mb-2 font-body-semibold">
                    Listas para bajar ({formaciones.length}):
                  </Text>
                  <View className="gap-2">
                    {formaciones.map((f, i) => {
                      const cartas = misCartas.filter((c) => f.cartaIds.includes(c.id))
                      return (
                        <View key={i} className="flex-row items-center gap-2 bg-felt-700/60 rounded-xl p-2">
                          <Text className="text-xs font-body-bold text-primary-300">{f.tipo}</Text>
                          <View className="flex-row gap-1 flex-wrap flex-1">
                            {cartas.map((c) => (
                              <Card key={c.id} carta={c} small />
                            ))}
                          </View>
                          <Pressable onPress={() => quitarFormacion(i)} className="px-1" hitSlop={8}>
                            <Text className="text-xs text-danger-400">✕</Text>
                          </Pressable>
                        </View>
                      )
                    })}
                  </View>
                </View>
              )}
            </ScrollView>

            <View className="flex-row gap-2 justify-end mt-2">
              <Button onPress={() => setShowFormationBuilder(false)} variant="neutral" size="sm" bold={false}>
                Cancelar
              </Button>
              <Button onPress={confirmar} disabled={!canConfirmar} variant="primary" size="sm">
                {`Confirmar (${totalFormaciones})`}
              </Button>
            </View>
          </View>
        </GlassPanel>
      </View>
    </Modal>
  )
}
