import React from 'react'
import { ExerciseProps } from '../components/ExerciseProps'
import { useStore } from '../utils/store'
import { ExerciseSets } from '../components/ExerciseSets'
import { v4 as uuid } from 'uuid'
import { Select, Button } from '../components/lib'
import { Box, Stack, Icon } from '@chakra-ui/core'

export function CurrentWorkout() {
  return (
    <Stack fontSize="xl" color="cyan.300" bg="gray.900" shouldWrapChildren>
      <Header />
      <ExerciseProps />
      <ExerciseSets />
    </Stack>
  )
}

function Header() {
  const { currentWorkoutProps, oneRepMaxProps, settingsRef } = useStore((store) => store)

  const addExerciseSet = () => {
    const itemCopy = { ...currentWorkoutProps }
    itemCopy.sets.push({ id: uuid(), reps: 5, rpe: 8 })
    settingsRef.set({ currentWorkoutProps: itemCopy }, { merge: true })
  }

  const selectExercise = (newName) => {
    const itemCopy = { ...currentWorkoutProps }
    itemCopy.shortName = newName
    settingsRef.set({ currentWorkoutProps: itemCopy }, { merge: true })
  }

  return (
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
        <Select value={currentWorkoutProps?.shortName} onChange={(e) => selectExercise(e.target.value)}>
          {oneRepMaxProps?.map(({ shortName, id }) => (
            <option key={id} value={shortName}>
              {shortName.toUpperCase()}
            </option>
          ))}
        </Select>
      </Box>
      <Box flex="0.5"></Box>
    </Stack>
  )
}
