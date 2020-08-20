import { ExerciseProps } from '../components/ExerciseProps'
import { useStore } from '../utils/store'
import { ExerciseSets } from '../components/ExerciseSets'
import { v4 as uuid } from 'uuid'
import { Select, Button } from '../components/lib'
import { Box, Stack, Icon } from '@chakra-ui/core'

export function ExerciseListItem({ exercise }) {
  const { currentWorkoutProps, oneRepMaxProps, settingsRef } = useStore((store) => store)

  const removeExercise = () => {
    const newCurrentWorkoutProps = currentWorkoutProps.filter((item) => item.id !== exercise.id)
    settingsRef.set({ currentWorkoutProps: newCurrentWorkoutProps }, { merge: true })
  }

  const addExerciseSet = () => {
    const itemCopy = [...currentWorkoutProps]
    const found = itemCopy.find((item) => item.id === exercise.id)
    found.sets.push({ id: uuid(), reps: 5, rpe: 8 })
    settingsRef.set({ currentWorkoutProps: itemCopy }, { merge: true })
  }

  const changeExerciseName = (newName) => {
    const itemCopy = [...currentWorkoutProps]
    const found = itemCopy.find((item) => item.id === exercise.id)
    found.shortName = newName
    settingsRef.set({ currentWorkoutProps: itemCopy }, { merge: true })
  }

  return (
    <Stack fontSize="xl" color="cyan.300" key={exercise.id} p="1" bg="gray.900" rounded="20px" border="4px solid" borderColor="cyan.300" shouldWrapChildren>
      <Stack isInline>
        <Box flex="0.5">
          <Button
            _hover={{
              bg: 'gray.900',
            }}
            bg="gray.900"
            fontWeight="black"
            width="full"
            onClick={addExerciseSet}
          >
            <Icon name="small-add" />
          </Button>
        </Box>
        <Box flex="1">
          <Select value={exercise.shortName} onChange={(e) => changeExerciseName(e.target.value)}>
            {oneRepMaxProps.map(({ shortName, id }) => (
              <option key={id} value={shortName}>
                {shortName.toUpperCase()}
              </option>
            ))}
          </Select>
        </Box>
        <Box flex="0.5">
          <Button
            _hover={{
              bg: 'gray.900',
            }}
            bg="gray.900"
            fontWeight="black"
            width="full"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this workout?')) removeExercise()
            }}
          >
            <Icon name="small-close" />
          </Button>
        </Box>
      </Stack>
      <ExerciseProps exercise={exercise} />
      <ExerciseSets exercise={exercise} />
    </Stack>
  )
}
