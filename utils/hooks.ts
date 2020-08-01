import { useEffect } from 'react'
import { writeStorage } from '.'
import { useStore } from './store'

export function useSyncStorage() {
  const { oneRepMaxProps, plates, warmupSetsProps, currentWorkoutProps, units } = useStore((store) => store)
  const { getOneRepMax } = useStore((store) => store.actions)

  useEffect(() => {
    if (!oneRepMaxProps) return
    writeStorage('oneRepMaxProps', oneRepMaxProps)
    getOneRepMax()
  }, [oneRepMaxProps])

  useEffect(() => {
    if (!warmupSetsProps) return
    writeStorage('warmupSetsProps', warmupSetsProps)
  }, [warmupSetsProps])

  useEffect(() => {
    if (!currentWorkoutProps) return
    writeStorage('currentWorkoutProps', currentWorkoutProps)
  }, [currentWorkoutProps])

  useEffect(() => {
    if (!plates) return
    writeStorage('plates', plates)
  }, [plates])

  useEffect(() => {
    if (!units) return
    writeStorage('units', units)
  }, [units])
}
