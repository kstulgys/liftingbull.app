import { Button, Stack, Box, Text } from '@chakra-ui/core'
import { calculateOneRepMax, getRepsList, getRpeList, getWorksetWeight } from '../utils'
import { useStore } from '../utils/store'
import { Select } from '../components/lib'

export function ExerciseProps({ exercise }) {
  const { oneRepMaxProps, settingsRef, currentWorkoutProps, units } = useStore((store) => store)

  const updateExerciseSet = (id, prop, data) => {
    const itemCopy = [...currentWorkoutProps]
    const found = itemCopy.find((item) => item.id === exercise.id)
    found.sets.find((item) => item.id === id)[prop] = data
    settingsRef.set({ currentWorkoutProps: itemCopy }, { merge: true })
  }

  const removeWorkoutSet = (idx) => {
    const itemCopy = [...currentWorkoutProps]
    const exerciseIdx = itemCopy.findIndex((item) => item.id === exercise.id)
    if (itemCopy[exerciseIdx].sets.length === 1) return
    itemCopy[exerciseIdx].sets.splice(idx, 1)
    settingsRef.set({ currentWorkoutProps: itemCopy }, { merge: true })
  }

  return (
    <Stack>
      {exercise.sets.map(({ rpe, reps, id }, idx) => {
        const oneRM = oneRepMaxProps.find((item) => item.shortName === exercise.shortName)
        const oneRMWeight = calculateOneRepMax({ weightKg: oneRM['weightKg'], weightLbs: oneRM['weightLbs'], units, rpe: oneRM.rpe, reps: oneRM.reps })

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
              <Text textAlign="center">{getWorksetWeight(rpe, reps, oneRMWeight)}</Text>
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
