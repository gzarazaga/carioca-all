import { View, ScrollView } from 'react-native'
import RoundInfo from './RoundInfo'
import TurnIndicator from './TurnIndicator'
import OpponentRow from './OpponentRow'
import DrawPile from './DrawPile'
import DiscardPile from './DiscardPile'
import FormationsArea from './FormationsArea'
import PlayerHand from './PlayerHand'

export default function GameBoard() {
  return (
    <ScrollView contentContainerClassName="items-center gap-4 p-4 w-full">
      <View className="flex-row gap-4 items-center flex-wrap justify-center">
        <RoundInfo />
        <TurnIndicator />
      </View>

      <OpponentRow />

      <View className="flex-row gap-8 items-center justify-center py-4">
        <DrawPile />
        <DiscardPile />
      </View>

      <FormationsArea />

      <PlayerHand />
    </ScrollView>
  )
}
