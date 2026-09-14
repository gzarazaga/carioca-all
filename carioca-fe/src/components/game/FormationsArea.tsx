import { useFormaciones } from '../../stores/gameStore'
import FormationGroup from './FormationGroup'

export default function FormationsArea() {
  const formaciones = useFormaciones()

  if (formaciones.length === 0) return null

  return (
    <div className="w-full">
      <h3 className="text-[11px] uppercase tracking-wider text-felt-300 mb-2 text-center">Formaciones en mesa</h3>
      <div className="flex gap-3 flex-wrap justify-center">
        {formaciones.map((f) => (
          <FormationGroup key={f.id} formacion={f} />
        ))}
      </div>
    </div>
  )
}
