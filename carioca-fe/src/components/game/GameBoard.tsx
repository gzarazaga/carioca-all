import RoundInfo from './RoundInfo'
import TurnIndicator from './TurnIndicator'
import OpponentRow from './OpponentRow'
import DrawPile from './DrawPile'
import DiscardPile from './DiscardPile'
import FormationsArea from './FormationsArea'
import PlayerHand from './PlayerHand'

export default function GameBoard() {
  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full max-w-5xl mx-auto">
      {/* Top: round info + turn */}
      <div className="flex gap-4 items-center flex-wrap justify-center">
        <RoundInfo />
        <TurnIndicator />
      </div>

      {/* Opponents */}
      <OpponentRow />

      {/* Table center: piles */}
      <div className="flex gap-8 items-center justify-center py-4">
        <DrawPile />
        <DiscardPile />
      </div>

      {/* Formations */}
      <FormationsArea />

      {/* Player hand */}
      <PlayerHand />
    </div>
  )
}
