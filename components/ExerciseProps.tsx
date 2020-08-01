import { Select, Button, Stack, Box, Text } from '@chakra-ui/core'
import { getRepsList, getRpeList, getWorksetWeight } from '../utils'
import { useStore } from '../utils/store'

export function ExerciseProps({ exercise, exerciseIdx }) {
  const { removeWorkoutSet, updateExerciseSet } = useStore((store) => store.actions)
  const { oneRepMax, units } = useStore((store) => store)
  if (!oneRepMax.lenght) return null

  return (
    <Stack>
      {exercise.sets.map(({ rpe, reps, id }, idx) => {
        const oneRM = oneRepMax?.find((item) => item.name === exercise.name)?.weight
        const oneRMWeight = units === 'kg' ? oneRM.kg : oneRM.lbs

        return (
          <Stack key={id} isInline alignItems="center">
            <Box flex="0.5">
              <Text textAlign="center">{idx + 1}.</Text>
            </Box>
            <Box flex="1">
              <Select defaultValue={rpe} onChange={(e) => updateExerciseSet(exerciseIdx, idx, 'rpe', e.target.value)}>
                {getRpeList().map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Select>
            </Box>
            <Box flex="1">
              <Select defaultValue={reps} onChange={(e) => updateExerciseSet(exerciseIdx, idx, 'reps', e.target.value)}>
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
              <Button width="full" onClick={() => removeWorkoutSet(exerciseIdx, idx)}>
                -
              </Button>
            </Box>
          </Stack>
        )
      })}
    </Stack>
  )
}
