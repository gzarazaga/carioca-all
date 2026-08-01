import { useState } from 'react'
import { View, Text, Pressable, Modal, ScrollView } from 'react-native'
import { useGameStore } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'
import type { FormacionInput } from '../../types/game'
import Card from '../card/Card'

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
      <View className="flex-1 bg-black/60 items-center justify-center p-4">
        <View className="bg-green-900 border border-green-600 rounded-xl p-6 max-w-lg w-full max-h-[90%]">
          <Text className="text-xl font-bold mb-4 text-white">Bajar formaciones</Text>

          <ScrollView>
            {poolCartas.length > 0 && (
              <View className="mb-4">
                <Text className="text-sm text-green-300 mb-2">
                  Cartas disponibles{' '}
                  <Text className="text-xs text-gray-400">(tocá para agregar a la formación actual)</Text>
                </Text>
                <View className="flex-row gap-1 flex-wrap">
                  {poolCartas.map((c) => (
                    <Card key={c.id} carta={c} small onPress={() => toggleCard(c.id)} />
                  ))}
                </View>
              </View>
            )}

            <View className="mb-4 border border-green-700 rounded-lg p-3">
              <Text className="text-sm text-green-300 mb-2 font-semibold">
                Formación actual{formaciones.length > 0 ? ` (#${formaciones.length + 1})` : ''}:
              </Text>

              {currentCartas.length > 0 ? (
                <View className="flex-row gap-1 flex-wrap mb-3">
                  {currentCartas.map((c) => (
                    <Card key={c.id} carta={c} small selected onPress={() => toggleCard(c.id)} />
                  ))}
                </View>
              ) : (
                <Text className="text-xs text-gray-400 mb-3">
                  {poolIds.length > 0
                    ? 'Seleccioná cartas de arriba para armar esta formación'
                    : 'No quedan cartas disponibles'}
                </Text>
              )}

              <View className="flex-row items-center gap-2 flex-wrap">
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setCurrentTipo('PIERNA')}
                    className={`px-3 py-1.5 rounded-lg ${currentTipo === 'PIERNA' ? 'bg-blue-600' : 'bg-gray-700'}`}
                  >
                    <Text className="font-bold text-xs text-white">Pierna</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setCurrentTipo('ESCALERA')}
                    className={`px-3 py-1.5 rounded-lg ${currentTipo === 'ESCALERA' ? 'bg-blue-600' : 'bg-gray-700'}`}
                  >
                    <Text className="font-bold text-xs text-white">Escalera</Text>
                  </Pressable>
                </View>

                {poolIds.length > 0 && (
                  <Pressable
                    onPress={agregarFormacion}
                    disabled={!canAgregar}
                    className={`px-3 py-1.5 bg-yellow-600 rounded-lg ${!canAgregar ? 'opacity-50' : ''}`}
                  >
                    <Text className="text-xs font-bold text-white">+ Agregar al listado</Text>
                  </Pressable>
                )}
              </View>
            </View>

            {formaciones.length > 0 && (
              <View className="mb-4">
                <Text className="text-sm text-green-300 mb-2 font-semibold">
                  Listas para bajar ({formaciones.length}):
                </Text>
                <View className="gap-2">
                  {formaciones.map((f, i) => {
                    const cartas = misCartas.filter((c) => f.cartaIds.includes(c.id))
                    return (
                      <View key={i} className="flex-row items-center gap-2 bg-green-800 rounded-lg p-2">
                        <Text className="text-xs font-bold text-blue-300">{f.tipo}</Text>
                        <View className="flex-row gap-1 flex-wrap flex-1">
                          {cartas.map((c) => (
                            <Card key={c.id} carta={c} small />
                          ))}
                        </View>
                        <Pressable onPress={() => quitarFormacion(i)} className="px-1">
                          <Text className="text-xs text-red-400">✕</Text>
                        </Pressable>
                      </View>
                    )
                  })}
                </View>
              </View>
            )}
          </ScrollView>

          <View className="flex-row gap-2 justify-end mt-2">
            <Pressable
              onPress={() => setShowFormationBuilder(false)}
              className="px-4 py-2 bg-gray-600 rounded-lg"
            >
              <Text className="text-sm text-white">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={confirmar}
              disabled={!canConfirmar}
              className={`px-4 py-2 bg-blue-600 rounded-lg ${!canConfirmar ? 'opacity-50' : ''}`}
            >
              <Text className="font-bold text-sm text-white">Confirmar ({totalFormaciones})</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
