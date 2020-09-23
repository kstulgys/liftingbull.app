import { Button, Stack, Box, Text } from '@chakra-ui/core'
import { calculateOneRepMax, getRepsList, getRpeList, getWorksetWeight } from '../utils'
import { useStore } from '../utils/store'
import { Select } from '../components/lib'
import { useDocument } from '@nandorojo/swr-firestore'
import { useAuth } from '../utils/useAuth'

export function ExerciseProps() {
  const { user } = useAuth((store) => store)
  const { data, update, error } = useDocument(`settings/${user?.uid}`, {
    listen: true,
  })

  const { oneRepMaxProps, settingsRef, currentWorkoutProps, units } = data
  // const { oneRepMaxProps, settingsRef, currentWorkoutProps, units } = useStore((store) => store)

  const updateExerciseSet = (id, prop, data) => {
    const itemCopy = { ...currentWorkoutProps }
    currentWorkoutProps.sets.find((item) => item.id === id)[prop] = data
    settingsRef.set({ currentWorkoutProps: itemCopy }, { merge: true })
  }

  const removeWorkoutSet = (idx) => {
    const itemCopy = { ...currentWorkoutProps }
    if (itemCopy.sets.length === 1) return
    itemCopy.sets.splice(idx, 1)
    settingsRef.set({ currentWorkoutProps: itemCopy }, { merge: true })
  }

  return (
    <Stack>
      {currentWorkoutProps?.sets.map(({ rpe, reps, id }, idx) => {
        const oneRM = oneRepMaxProps.find((item) => item.shortName === currentWorkoutProps.shortName)
        const { weightKg, weightLbs } = oneRM
        const oneRMWeight = calculateOneRepMax({ weightKg, weightLbs, units, rpe: oneRM.rpe, reps: oneRM.reps })
        const worksetWeight = getWorksetWeight(rpe, reps, oneRMWeight)

        return (
          <Stack key={id} isInline alignItems="center" fontWeight="bold">
            <Box flex="0.5">
              <Text textAlign="center">{idx + 1}.</Text>
            </Box>
            <Box flex="1">
              <Select value={rpe} onChange={(e) => updateExerciseSet(id, 'rpe', +e.target.value)}>
                {getRpeList().map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Select>
            </Box>
            <Box flex="1">
              <Select value={reps} onChange={(e) => updateExerciseSet(id, 'reps', +e.target.value)}>
                {getRepsList().map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Select>
            </Box>
            <Box flex="0.7">
              <Text textAlign="center">{units === 'kg' ? worksetWeight : Math.round(worksetWeight)}</Text>
            </Box>
            <Box flex="0.5">
              <Button bg="gray.900" fontWeight="bold" fontSize="xl" width="full" onClick={() => removeWorkoutSet(idx)}>
                -
              </Button>
            </Box>
          </Stack>
        )
      })}
    </Stack>
  )
}
