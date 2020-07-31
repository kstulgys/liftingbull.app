import {
  Box,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  Stack,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  AccordionIcon,
  Select,
  Icon,
  IconButton,
  Flex,
  Checkbox,
} from '@chakra-ui/core'

import { useEffect, useRef, useState } from 'react'
import { calcOneRepMaxKg, getPlatesOnBar, getWorksetWeight, writeStorage } from '../utils'
import { useStore } from '../utils/store'

export default function IndexPage() {
  const { initializeState, addWorkout } = useStore((store) => store.actions)
  useSyncStorage()

  useEffect(() => {
    initializeState()
  }, [])

  return (
    <Stack bg="gray.800">
      <Stack shouldWrapChildren maxW="sm" width="full" mx="auto" minH="100vh" p="4">
        <AppDrawer />
        <ExerciseList />
        <Stack mt="4">
          <Button onClick={addWorkout} size="lg">
            Add workout
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}

function ExerciseList() {
  const { currentWorkoutProps, oneRepMaxProps } = useStore((store) => store)
  const { removeWorkout, addWorkoutSet } = useStore((store) => store.actions)

  return (
    <Stack spacing="4">
      {currentWorkoutProps?.map((exercise, idx) => {
        return (
          <Stack key={exercise.id} p="1" bg="white" borderRadius="md" boxShadow="md">
            <Stack isInline>
              <Box flex="0.5">
                <Button width="full" onClick={() => addWorkoutSet(idx)}>
                  +
                </Button>
              </Box>
              <Box flex="1">
                <Select>
                  {oneRepMaxProps.map(({ name }) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box flex="0.5">
                <Button
                  width="full"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this workout?')) removeWorkout(exercise.id)
                  }}
                >
                  x
                </Button>
              </Box>
            </Stack>
            <ExerciseProps exercise={exercise} exerciseIdx={idx} />
            <ExerciseSets exercise={exercise} />
          </Stack>
        )
      })}
    </Stack>
  )
}

function ExerciseProps({ exercise, exerciseIdx }) {
  const { removeWorkoutSet, updateExerciseSet } = useStore((store) => store.actions)
  const { oneRepMax } = useStore((store) => store)

  return (
    <Stack>
      {exercise.sets.map(({ rpe, reps, id }, idx) => {
        const oneRM = oneRepMax?.find((item) => item.name === exercise.name)?.weight

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
              <Text textAlign="center">{getWorksetWeight(rpe, reps, oneRM)}</Text>
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

function ExerciseSets({ exercise }) {
  const { warmupSetsProps, plates, oneRepMax, units } = useStore((store) => store)

  const workSet = exercise.sets[0]
  const oneRM = oneRepMax?.find((item) => item.name === exercise.name)?.weight
  const weight = getWorksetWeight(workSet.rpe, workSet.reps, oneRM)
  const currentPlates = units === 'kg' ? plates.kg : plates.lbs

  return (
    <Stack>
      <Accordion allowToggle defaultIndex={[999]} allowMultiple>
        <AccordionItem>
          <AccordionHeader>
            <Box flex="1" textAlign="left">
              Warmup sets
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel pb={4}>
            <Stack>
              <Stack isInline>
                <Box>
                  <Text>no.</Text>
                </Box>
                <Box>
                  <Text>percent</Text>
                </Box>
                <Box>
                  <Text> weight</Text>
                </Box>
                <Box>
                  <Text>reps</Text>
                </Box>
              </Stack>
              {warmupSetsProps.map(({ percent, reps, id }, idx) => {
                const warmupWeight = Math.round(weight * percent)
                return (
                  <Stack key={id} isInline>
                    <Box>
                      <Text>{idx + 1}.</Text>
                    </Box>
                    <Box>
                      <Text>{Math.round(percent * 100)}%</Text>
                    </Box>
                    <Box>
                      <Text>
                        {getPlatesOnBar(warmupWeight, 20, currentPlates)} {warmupWeight}
                      </Text>
                    </Box>
                    <Box>
                      <Text>{reps}</Text>
                    </Box>
                  </Stack>
                )
              })}
            </Stack>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <Box flex="1" textAlign="left">
              Work sets plates
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Stack>
  )
}

function AppDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure(false)
  const btnRef = useRef()

  return (
    <>
      <Flex>
        <Button ml="auto" bg="white" variant="ghost" onClick={onOpen} ref={btnRef}>
          <Icon name="drag-handle" transform="rotate(90deg)" size="10" />
        </Button>
      </Flex>

      <Drawer size="sm" isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent overflowY="auto">
          <DrawerCloseButton size="lg" mt="2" mr="1" />

          <DrawerBody m="0" px="0" mt="16">
            <DrawerAcordion />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              color="blue"
              onClick={() => {
                window.localStorage.clear()
                window.location.reload()
              }}
            >
              Reset
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

function DrawerAcordion() {
  const [units, setUnits] = useState<any>('kg')
  const { oneRepMaxProps, oneRepMax, plates } = useStore((store) => store)
  const { updateOneRepMaxProps, updatePlates } = useStore((store) => store.actions)
  const defaultPlates = { kg: [25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25], lbs: [45, 35, 25, 10, 5, 2.5] }

  return (
    <Accordion defaultIndex={[999]} allowToggle>
      <AccordionItem>
        <AccordionHeader>
          <Box flex="1" textAlign="left" fontSize="2xl" fontWeight="bold">
            One Rep Max
          </Box>
          <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel pb={4}>
          <Stack isInline fontWeight="bold" mb="2" fontSize="sm">
            <Box flex="0.6">
              <Text>NAME</Text>
            </Box>
            <Box flex="1">
              <Text textAlign="center">RPE</Text>
            </Box>
            <Box flex="1">
              <Text textAlign="center">REPS</Text>
            </Box>
            <Box flex="1">
              <Text textAlign="center">WEIGHT</Text>
            </Box>
            <Box flex="0.6">
              <Text textAlign="end">1RM</Text>
            </Box>
          </Stack>

          {oneRepMaxProps?.map(({ name: _name, id, rpe, reps, weight }) => {
            const oneRm = oneRepMax?.find(({ name }) => name === _name)?.weight
            return (
              <Stack key={id} isInline alignItems="center" spacing="1" mt="1">
                <Box flex="0.6">
                  <Text textAlign="start">{_name}</Text>
                </Box>
                <Box flex="1">
                  <Select defaultValue={rpe} onChange={(e) => updateOneRepMaxProps(_name, 'rpe', e.target.value)}>
                    {getRpeList().map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Box flex="1">
                  <Select defaultValue={reps} onChange={(e) => updateOneRepMaxProps(_name, 'reps', e.target.value)}>
                    {getRepsList().map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Box flex="1">
                  <Select defaultValue={weight} onChange={(e) => updateOneRepMaxProps(_name, 'weight', e.target.value)}>
                    {getWeightNumbers().map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Box flex="0.6">
                  <Text textAlign="end">{oneRm}</Text>
                </Box>
              </Stack>
            )
          })}
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionHeader>
          <Box flex="1" textAlign="left" fontSize="2xl" fontWeight="bold">
            Variants
          </Box>
          <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel pb={4}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionHeader>
          <Box flex="1" textAlign="left" fontSize="2xl" fontWeight="bold">
            Settings
          </Box>
          <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel pb={4}>
          <Stack spacing="4">
            <Stack isInline alignItems="center">
              <Box>
                <Text fontSize="xl">Units</Text>
              </Box>
              <Box width="25%" ml="auto">
                <Select defaultValue={units} onChange={(e) => setUnits(e.target.value)}>
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </Select>
              </Box>
            </Stack>

            <Stack>
              <Box>
                <Text fontSize="xl">Warmup sets</Text>
              </Box>
              <WarmupSets />
            </Stack>
            <Stack>
              <Box>
                <Text fontSize="xl">Plates</Text>
              </Box>
              <Box>
                <Text>KG</Text>
              </Box>
              <Stack isInline flexWrap="wrap">
                {defaultPlates?.kg.map((plate) => (
                  <Checkbox key={plate} value={plate} onChange={(e) => updatePlates('kg', +e.target.value)} isChecked={plates?.kg.includes(plate)} size="lg">
                    {plate}
                  </Checkbox>
                ))}
              </Stack>
              <Box>
                <Text>LBS</Text>
              </Box>
              <Stack isInline flexWrap="wrap">
                {defaultPlates?.lbs.map((plate) => (
                  <Checkbox
                    key={plate}
                    value={plate}
                    onChange={(e) => updatePlates('lbs', +e.target.value)}
                    isChecked={plates?.lbs.includes(plate)}
                    bg={plates?.lbs.includes(plate)}
                    size="lg"
                  >
                    {plate}
                  </Checkbox>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

function WarmupSets() {
  const { warmupSetsProps } = useStore((store) => store)
  const { updateWarmupSet, addWarmupSet, removeWarmupSet } = useStore((store) => store.actions)

  return (
    <Stack>
      <Stack isInline fontWeight="bold" fontSize="sm">
        <Box flex="0.3">
          <Text>SET</Text>
        </Box>
        <Box flex="1">
          <Text textAlign="center">PERCENT</Text>
        </Box>
        <Box flex="1">
          <Text textAlign="center">REPS</Text>
        </Box>
        <Box flex="0.3" />
      </Stack>
      {warmupSetsProps?.map(({ percent, reps, id }, idx) => {
        return (
          <Stack key={id} isInline alignItems="center">
            <Box flex="0.3">
              <Text>{idx + 1}.</Text>
            </Box>
            <Box flex="1">
              <Box>
                <Select defaultValue={percent} onChange={(e) => updateWarmupSet(id, 'percent', e.target.value)}>
                  {getWeightPercents().map((num) => (
                    <option key={num} value={num}>
                      {Math.round(num * 100)}
                    </option>
                  ))}
                </Select>
              </Box>
            </Box>
            <Box flex="1">
              <Box>
                <Select defaultValue={reps} onChange={(e) => updateWarmupSet(id, 'reps', e.target.value)}>
                  {getRepsNumbers().map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </Select>
              </Box>
            </Box>
            <Box flex="0.3">
              <Button width="full" onClick={() => removeWarmupSet(id)}>
                -
              </Button>
            </Box>
          </Stack>
        )
      })}

      <Box ml="auto">
        <Button onClick={addWarmupSet}>Add</Button>
      </Box>
    </Stack>
  )
}

function getRepsNumbers() {
  return Array(20)
    .fill(null)
    .map((_, idx) => idx + 1)
}

function getWeightPercents() {
  const array = Array(110)
    .fill(null)
    .map((_, idx) => {
      const numString = idx + 1 + ''
      if (numString[numString.length - 1] === '0' || numString[numString.length - 1] === '5') {
        return (idx + 1) / 100
      }
    })
    .filter(Boolean)
  return [0, ...array]
}

function getWeightNumbers() {
  return Array(1000)
    .fill(null)
    .map((_, idx) => idx + 1)
}

function getRpeList() {
  return [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]
}

function getRepsList() {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}

function useSyncStorage() {
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
