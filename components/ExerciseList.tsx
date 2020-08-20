import { useStore } from '../utils/store'
import { Stack } from '@chakra-ui/core'
import { ExerciseListItem } from '../components/ExerciseListItem'

export function ExerciseList() {
  const { currentWorkoutProps } = useStore((store) => store)

  return (
    <Stack spacing="4" mt="2" shouldWrapChildren>
      {currentWorkoutProps?.map((exercise) => {
        return <ExerciseListItem key={exercise.id} exercise={exercise} />
      })}
    </Stack>
  )
}
